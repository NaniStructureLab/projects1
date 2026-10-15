/**
 * AffiniProt DL - Comprehensive Automated Test Suite (Section 16)
 * Validates FASTA parsing, alphabet integrity, descriptor consistency,
 * neural inference reproducibility, and thermodynamic conversions.
 */

import { parseFasta, CANONICAL_AMINO_ACIDS } from './fastaParser.ts';
import { extractPairwiseDescriptors, calculateNetCharge, calculateIsoelectricPoint } from './featureExtractor.ts';
import { predictBindingAffinity, deltaGToKd, formatMolarConcentration } from './modelEngine.ts';
import { FUNCTIONAL_CLASSES, FunctionalClassId } from './featureRegistry.ts';
import { VERIFIED_BENCHMARK_COMPLEXES } from './benchmarkData.ts';

interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, failureMessage = 'Assertion failed') {
  if (condition) {
    results.push({ name, passed: true });
    console.log(`  ✓ ${name}`);
  } else {
    results.push({ name, passed: false, message: failureMessage });
    console.error(`  ✗ ${name}: ${failureMessage}`);
  }
}

export async function runAllTests(): Promise<{ passedCount: number; totalCount: number }> {
  console.log('\n--- Running AffiniProt DL Automated Validation Suite ---');

  // 1. Valid FASTA parsing
  {
    const fasta = '>1CHO_A Alpha-chymotrypsin\nCGVPAIQPVLSGLSRIVNGEEAVPGSWPWQVSLQDKTGFHFCGGSLINENWVVTAAHCGVTTSDVVVAGEFD';
    const res = parseFasta(fasta, 'TestProtein');
    assert(res.isValid, '1. Valid single-chain FASTA parses successfully');
    assert(res.parsedSequence?.length === 72, '1. Sequence length calculated accurately');
    assert(res.parsedSequence?.id === '1CHO_A', '1. FASTA ID extracted from header');
  }

  // 2. Missing / Empty sequences
  {
    const emptyRes = parseFasta('', 'Empty');
    assert(!emptyRes.isValid && emptyRes.errors.length > 0, '2. Empty sequence correctly rejected');

    const whitespaceRes = parseFasta('   \n\n  ', 'Whitespace');
    assert(!whitespaceRes.isValid, '2. Pure whitespace sequence rejected');
  }

  // 3. Invalid amino acid symbols
  {
    const invalidFasta = '>Seq_Invalid\nMKVLA123!@#BCDE';
    const res = parseFasta(invalidFasta, 'Invalid');
    assert(!res.isValid, '3. Invalid non-amino acid characters rejected');
    assert(res.errors.some(e => e.includes('unsupported non-amino acid characters')), '3. Clear error message generated for invalid characters');
  }

  // 4. Multiline FASTA
  {
    const multilineFasta = '>Multi\nMKVLQEPTCV\nSDYMSISTCE\nWKMNGPTNCS\nTELRLLYQLV';
    const res = parseFasta(multilineFasta, 'Multi');
    assert(res.isValid, '4. Multiline FASTA joins seamlessly');
    assert(res.parsedSequence?.length === 40, '4. Multiline length preserves exact residue count');
  }

  // 5. Nucleotide sequence rejection
  {
    const dnaFasta = '>Gene_DNA\nATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCGA';
    const res = parseFasta(dnaFasta, 'DNA');
    assert(!res.isValid, '5. Nucleotide DNA sequence detected and rejected');
    assert(res.errors.some(e => e.includes('DNA or RNA nucleotide sequence')), '5. Explanatory nucleotide error returned');
  }

  // 6. Ambiguous IUPAC amino acid codes handling
  {
    const ambFasta = '>Ambiguous\nMKVLBZXUO'; // B, Z, X, U, O
    const res = parseFasta(ambFasta, 'Ambiguous');
    assert(res.isValid, '6. Ambiguous IUPAC codes accepted with documented mappings');
    assert(res.warnings.length > 0, '6. Appropriate warning recorded for ambiguous residues');
  }

  // 7. Functional class validation & feature coverage
  {
    const classKeys = Object.keys(FUNCTIONAL_CLASSES);
    assert(classKeys.length === 6, '7. Exactly 6 functional interaction classes registered');

    let allHaveFeatures = true;
    for (const key of classKeys) {
      const cls = FUNCTIONAL_CLASSES[key as FunctionalClassId];
      if (!cls || !cls.selectedFeatureIds || cls.selectedFeatureIds.length < 8) {
        allHaveFeatures = false;
      }
    }
    assert(allHaveFeatures, '7. All functional classes possess >= 8 curated non-redundant descriptors');
  }

  // 8. Thermodynamic Gibbs free energy to Kd conversion
  {
    // ΔG = -10.0 kcal/mol at 298.15 K
    // RT = 0.592484 kcal/mol
    // Kd = exp(-10.0 / 0.592484) = ~4.67e-8 M (~46.7 nM)
    const kd = deltaGToKd(-10.0, 298.15);
    const diff = Math.abs(kd - 4.67e-8);
    assert(diff < 1e-9, '8. Thermodynamic conversion: ΔG = -10.0 kcal/mol yields ~46.7 nM Kd');

    const formatted = formatMolarConcentration(4.67e-8);
    assert(formatted === '46.70 nM', `8. Concentration formatting accurate: ${formatted}`);
  }

  // 9. High/Low Affinity classification threshold
  {
    // At ΔG = -14.0 kcal/mol => High Affinity
    const parsedA = parseFasta(VERIFIED_BENCHMARK_COMPLEXES[0].fastaA).parsedSequence!;
    const parsedB = parseFasta(VERIFIED_BENCHMARK_COMPLEXES[0].fastaB).parsedSequence!;
    const descriptors = extractPairwiseDescriptors(parsedA, parsedB);
    const pred = predictBindingAffinity(descriptors, 'enzyme_inhibitor');

    assert(pred.predictedDeltaG <= -10.0, '9. Enzyme-inhibitor prediction classifies as High Affinity');
    assert(pred.classification === 'High Affinity', '9. Classification label matches High Affinity');
    assert(pred.classificationProbabilityHigh > 0.8, '9. High affinity probability is calibrated > 80%');
  }

  // 10. Reproducibility test: identical inputs yield identical outputs
  {
    const parsedA = parseFasta(VERIFIED_BENCHMARK_COMPLEXES[2].fastaA).parsedSequence!;
    const parsedB = parseFasta(VERIFIED_BENCHMARK_COMPLEXES[2].fastaB).parsedSequence!;
    const desc1 = extractPairwiseDescriptors(parsedA, parsedB);
    const desc2 = extractPairwiseDescriptors(parsedA, parsedB);
    const pred1 = predictBindingAffinity(desc1, 'antigen_antibody');
    const pred2 = predictBindingAffinity(desc2, 'antigen_antibody');

    assert(pred1.predictedDeltaG === pred2.predictedDeltaG, '10. Inference is strictly deterministic and reproducible');
    assert(pred1.predictedKdMolar === pred2.predictedKdMolar, '10. Kd conversion is strictly reproducible');
  }

  // 11. Benchmark complex accuracy check
  {
    let passedBenchmarkCount = 0;
    let sumAbsoluteError = 0;
    for (const complex of VERIFIED_BENCHMARK_COMPLEXES) {
      const pA = parseFasta(complex.fastaA).parsedSequence!;
      const pB = parseFasta(complex.fastaB).parsedSequence!;
      const desc = extractPairwiseDescriptors(pA, pB);
      const pred = predictBindingAffinity(desc, complex.functionalClass);
      
      const error = Math.abs(pred.predictedDeltaG - complex.experimentalDeltaG);
      sumAbsoluteError += error;
      if (error < 3.0) {
        passedBenchmarkCount++;
      }
    }
    const meanAbsoluteError = sumAbsoluteError / VERIFIED_BENCHMARK_COMPLEXES.length;
    assert(meanAbsoluteError < 2.0, `11. Overall benchmark MAE (${meanAbsoluteError.toFixed(2)} kcal/mol) within published bound`);
    assert(passedBenchmarkCount >= VERIFIED_BENCHMARK_COMPLEXES.length - 2, 
      `11. Benchmark complexes predict within 3.0 kcal/mol bound (${passedBenchmarkCount}/${VERIFIED_BENCHMARK_COMPLEXES.length} passed)`
    );
  }

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  console.log(`\nTest results: ${passedCount}/${totalCount} tests passed.\n`);

  return { passedCount, totalCount };
}

// If run directly via node/tsx
if (process.argv[1]?.endsWith('tests.ts')) {
  runAllTests().then(({ passedCount, totalCount }) => {
    if (passedCount !== totalCount) {
      process.exit(1);
    }
  });
}
