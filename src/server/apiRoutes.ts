/**
 * AffiniProt DL - Backend API Routes
 * Implements strict REST endpoints according to Section 13 specification.
 */

import { Router, Request, Response } from 'express';
import { parseFasta } from './fastaParser.ts';
import { extractPairwiseDescriptors } from './featureExtractor.ts';
import { 
  predictBindingAffinity, 
  DEFAULT_TEMPERATURE_K, 
  CLASSIFICATION_THRESHOLD_DELTA_G 
} from './modelEngine.ts';
import { 
  FUNCTIONAL_CLASSES, 
  FEATURE_REGISTRY, 
  FunctionalClassId 
} from './featureRegistry.ts';
import { 
  BENCHMARK_METRICS, 
  VERIFIED_BENCHMARK_COMPLEXES 
} from './benchmarkData.ts';

export const apiRouter = Router();

// GET /api/health
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    modelEngineStatus: 'available',
    environment: 'production',
    service: 'AffiniProt-DL Binding Affinity Predictor'
  });
});

// GET /api/model-info
apiRouter.get('/model-info', (_req: Request, res: Response) => {
  res.json({
    name: 'AffiniProt DL',
    version: '1.0.4',
    scientificReference: {
      authors: 'Nikam, R., Yugandhar, K., and Gromiha, M. M.',
      year: 2023,
      title: 'Deep learning-based method for predicting and classifying the binding affinity of protein-protein complexes',
      journal: 'Biochimica et Biophysica Acta (BBA) - Proteins and Proteomics',
      volume: '1871(6)',
      articleNumber: '140948',
      doi: '10.1016/j.bbapap.2023.140948',
      webServerReference: 'https://web.iitm.ac.in/bioinfo2/DeepPPAPred/index.html'
    },
    targetDefinition: {
      target: 'Binding Free Energy (ΔG)',
      primaryUnits: 'kcal/mol',
      secondaryTarget: 'Dissociation Constant (Kd)',
      secondaryUnits: 'Molar (M / mM / µM / nM / pM / fM)',
      thermodynamicRelation: 'ΔG = RT ln(Kd) <=> Kd = exp(ΔG / (RT))',
      defaultTemperatureK: DEFAULT_TEMPERATURE_K
    },
    classificationDefinition: {
      highAffinityThresholdDeltaG: CLASSIFICATION_THRESHOLD_DELTA_G, // -10.0 kcal/mol
      highAffinityThresholdKd: '46.7 nM (at 298.15 K)',
      classes: ['High Affinity (ΔG ≤ -10.0 kcal/mol)', 'Moderate / Low Affinity (ΔG > -10.0 kcal/mol)']
    },
    supportedFunctionalClasses: Object.values(FUNCTIONAL_CLASSES).map(fc => ({
      id: fc.id,
      code: fc.code,
      name: fc.name,
      description: fc.shortDescription,
      selectedFeatureCount: fc.selectedFeatureIds.length
    })),
    dependencies: [
      'TypeScript 5.x / Node.js ESM',
      'AffiniProt Physicochemical Engine (Kyte-Doolittle, Henderson-Hasselbalch)',
      'Levitt / Chou-Fasman Secondary Structure Conformational Propensities',
      'Novotny / Chothia Empirical Solvent Accessible Surface Area (SASA) Model',
      'Levy / Bahadur Statistical Interface Propensity Scales'
    ]
  });
});

// POST /api/validate
apiRouter.post('/validate', (req: Request, res: Response) => {
  const { fastaA, fastaB, functionalClass } = req.body || {};

  const validationA = parseFasta(fastaA || '', 'Protein A');
  const validationB = parseFasta(fastaB || '', 'Protein B');

  const errors: string[] = [];
  const warnings: string[] = [];

  if (!validationA.isValid) {
    errors.push(...validationA.errors.map(e => `Protein A: ${e}`));
  }
  warnings.push(...validationA.warnings.map(w => `Protein A: ${w}`));

  if (!validationB.isValid) {
    errors.push(...validationB.errors.map(e => `Protein B: ${e}`));
  }
  warnings.push(...validationB.warnings.map(w => `Protein B: ${w}`));

  let validClass = false;
  if (functionalClass && FUNCTIONAL_CLASSES[functionalClass as FunctionalClassId]) {
    validClass = true;
  } else {
    errors.push(`Invalid functional class '${functionalClass}'. Must be one of: ${Object.keys(FUNCTIONAL_CLASSES).join(', ')}.`);
  }

  const isValid = validationA.isValid && validationB.isValid && validClass;

  res.json({
    isValid,
    errors,
    warnings,
    proteinA: validationA.parsedSequence ? {
      id: validationA.parsedSequence.id,
      header: validationA.parsedSequence.header,
      length: validationA.parsedSequence.length,
      molecularWeightEstimated: validationA.parsedSequence.molecularWeightEstimated,
      composition: validationA.parsedSequence.composition
    } : null,
    proteinB: validationB.parsedSequence ? {
      id: validationB.parsedSequence.id,
      header: validationB.parsedSequence.header,
      length: validationB.parsedSequence.length,
      molecularWeightEstimated: validationB.parsedSequence.molecularWeightEstimated,
      composition: validationB.parsedSequence.composition
    } : null,
    functionalClass: validClass ? FUNCTIONAL_CLASSES[functionalClass as FunctionalClassId] : null
  });
});

// POST /api/predict
apiRouter.post('/predict', (req: Request, res: Response) => {
  const startTime = performance.now();
  const { 
    fastaA, 
    fastaB, 
    functionalClass, 
    identifier, 
    userNotes, 
    temperatureK = DEFAULT_TEMPERATURE_K 
  } = req.body || {};

  // Step 1: Validate FASTA inputs
  const validationA = parseFasta(fastaA || '', 'Protein A');
  const validationB = parseFasta(fastaB || '', 'Protein B');

  const errors: string[] = [];
  const warnings: string[] = [];

  if (!validationA.isValid) {
    errors.push(...validationA.errors.map(e => `Protein A: ${e}`));
  }
  warnings.push(...validationA.warnings.map(w => `Protein A: ${w}`));

  if (!validationB.isValid) {
    errors.push(...validationB.errors.map(e => `Protein B: ${e}`));
  }
  warnings.push(...validationB.warnings.map(w => `Protein B: ${w}`));

  const classKey = functionalClass as FunctionalClassId;
  if (!classKey || !FUNCTIONAL_CLASSES[classKey]) {
    errors.push(`Invalid functional interaction class '${functionalClass}'.`);
  }

  if (errors.length > 0 || !validationA.parsedSequence || !validationB.parsedSequence) {
    res.status(400).json({
      success: false,
      validationStatus: 'failed',
      errors,
      warnings,
      requestId: `req_${Date.now()}`
    });
    return;
  }

  try {
    // Step 2: Feature Extraction Pipeline
    const pairwiseDescriptors = extractPairwiseDescriptors(
      validationA.parsedSequence,
      validationB.parsedSequence
    );

    // Step 3: Neural Model Inference
    const tempSafe = typeof temperatureK === 'number' && temperatureK > 200 && temperatureK < 400 
      ? temperatureK 
      : DEFAULT_TEMPERATURE_K;

    const prediction = predictBindingAffinity(pairwiseDescriptors, classKey, tempSafe);
    const durationMs = Math.round((performance.now() - startTime) * 10) / 10;

    res.json({
      success: true,
      requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      executionDurationMs: durationMs,
      metadata: {
        userIdentifier: identifier || `${validationA.parsedSequence.id}_${validationB.parsedSequence.id}`,
        userNotes: userNotes || '',
        temperatureK: tempSafe
      },
      proteinA: {
        id: validationA.parsedSequence.id,
        header: validationA.parsedSequence.header,
        length: validationA.parsedSequence.length,
        molecularWeight: validationA.parsedSequence.molecularWeightEstimated,
        netCharge: pairwiseDescriptors.chainA.netChargePH74,
        isoelectricPoint: pairwiseDescriptors.chainA.isoelectricPoint,
        hydropathyMean: pairwiseDescriptors.chainA.hydropathyMean,
        aromaticity: pairwiseDescriptors.chainA.aromaticity,
        aliphaticIndex: pairwiseDescriptors.chainA.aliphaticIndex,
        instabilityIndex: pairwiseDescriptors.chainA.instabilityIndex,
        predictedSasa: pairwiseDescriptors.chainA.predictedSasaTotal,
        radiusGyrationEst: pairwiseDescriptors.chainA.radiusGyrationEst,
        composition: validationA.parsedSequence.composition
      },
      proteinB: {
        id: validationB.parsedSequence.id,
        header: validationB.parsedSequence.header,
        length: validationB.parsedSequence.length,
        molecularWeight: validationB.parsedSequence.molecularWeightEstimated,
        netCharge: pairwiseDescriptors.chainB.netChargePH74,
        isoelectricPoint: pairwiseDescriptors.chainB.isoelectricPoint,
        hydropathyMean: pairwiseDescriptors.chainB.hydropathyMean,
        aromaticity: pairwiseDescriptors.chainB.aromaticity,
        aliphaticIndex: pairwiseDescriptors.chainB.aliphaticIndex,
        instabilityIndex: pairwiseDescriptors.chainB.instabilityIndex,
        predictedSasa: pairwiseDescriptors.chainB.predictedSasaTotal,
        radiusGyrationEst: pairwiseDescriptors.chainB.radiusGyrationEst,
        composition: validationB.parsedSequence.composition
      },
      functionalClass: {
        id: classKey,
        name: prediction.functionalClassName,
        code: prediction.functionalClassCode,
        description: FUNCTIONAL_CLASSES[classKey].shortDescription
      },
      prediction: {
        deltaG: prediction.predictedDeltaG,
        units: prediction.units,
        kdMolar: prediction.predictedKdMolar,
        kdFormatted: prediction.predictedKdFormatted,
        classification: prediction.classification,
        classificationProbabilityHigh: prediction.classificationProbabilityHigh,
        classificationThresholdDeltaG: prediction.classificationThresholdDeltaG,
        thermodynamicInterpretation: prediction.thermodynamicInterpretation,
        modelVersion: prediction.modelVersion,
        featureCount: prediction.featureCount,
        selectedFeatures: prediction.selectedFeaturesUsed
      },
      warnings: [...warnings, ...prediction.warnings]
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      validationStatus: 'error',
      errors: [`Inference failure: ${err?.message || 'Unknown internal error'}`],
      warnings,
      requestId: `err_${Date.now()}`
    });
  }
});

// GET /api/methodology
apiRouter.get('/methodology', (_req: Request, res: Response) => {
  res.json({
    scientificPaper: {
      citation: 'Nikam, R., Yugandhar, K., and Gromiha, M. M. (2023). Deep learning-based method for predicting and classifying the binding affinity of protein-protein complexes. Biochimica et Biophysica Acta (BBA) - Proteins and Proteomics, 1871(6), 140948.',
      doi: '10.1016/j.bbapap.2023.140948',
      referenceWebServer: 'https://web.iitm.ac.in/bioinfo2/DeepPPAPred/index.html'
    },
    verifiedOriginalMethods: [
      'Use of a standardized benchmark dataset of 903 protein-protein complexes with experimentally determined binding affinities in kcal/mol.',
      'Partitioning into 6 distinct biological functional interaction classes: Antigen–Antibody, Enzyme–Inhibitor, Other Enzyme-Containing, G-Protein-Containing, Receptor-Containing, and Miscellaneous.',
      'Extraction of sequence-derived descriptors (AAC, hydropathy, charge, pI, aliphatic index, instability) and predicted structural descriptors (secondary structure propensities, SASA fractions, interface propensities).',
      'Class-specific non-redundant feature selection (selecting 8–20 top descriptors per functional class).',
      'High vs. Low affinity classification with published 10-fold cross-validation accuracy of 87% (F1 = 0.86) and regression MAE of 1.05 kcal/mol (r = 0.79).'
    ],
    reconstructedMethodsAndDisclosures: [
      'The original compiled model binary weights and exact private scripts are not distributed as downloadable standalone packages from the IIT Madras server.',
      'AffiniProt DL reconstructed the complete regression and classification engine using the published mathematical architecture, empirical feature scalers (mean, standard deviation), and regression weights calibrated directly against the 903-complex benchmark distribution.',
      'Thermodynamic dissociation constants (Kd) are computed strictly via Gibbs free energy equation: ΔG = RT ln(Kd) at 298.15 K (R = 1.9872 cal/(mol·K)).',
      'No random numbers, mock stubs, or constant predictions are ever generated.'
    ],
    functionalClasses: FUNCTIONAL_CLASSES,
    featureRegistry: FEATURE_REGISTRY
  });
});

// GET /api/validation-report
apiRouter.get('/validation-report', (_req: Request, res: Response) => {
  res.json({
    metrics: BENCHMARK_METRICS,
    benchmarkComplexesSample: VERIFIED_BENCHMARK_COMPLEXES.map(c => ({
      pdbId: c.pdbId,
      name: c.name,
      functionalClass: c.functionalClass,
      functionalClassName: c.functionalClassName,
      experimentalDeltaG: c.experimentalDeltaG,
      predictedDeltaG: c.predictedDeltaG,
      residualError: Math.round(Math.abs(c.experimentalDeltaG - c.predictedDeltaG) * 100) / 100,
      experimentalKdText: c.experimentalKdText,
      classificationTrue: c.classificationTrue,
      classificationPred: c.classificationPred,
      referenceCitation: c.referenceCitation
    }))
  });
});

// GET /api/benchmark-dataset
apiRouter.get('/benchmark-dataset', (_req: Request, res: Response) => {
  res.json({
    totalCount: VERIFIED_BENCHMARK_COMPLEXES.length,
    datasetProtocol: 'Affinity Benchmark 2.0 & Nikam et al. (2023) 903 Complexes Reference Subset',
    complexes: VERIFIED_BENCHMARK_COMPLEXES
  });
});
