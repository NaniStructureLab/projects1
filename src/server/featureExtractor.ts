/**
 * AffiniProt DL - Feature Extraction Pipeline
 * Extracts verified sequence and predicted structure descriptors for protein pairs.
 */

import type { ParsedSequence } from './fastaParser.ts';

// Kyte-Doolittle Hydropathy Index (1982)
export const KYTE_DOOLITTLE: Record<string, number> = {
  A: 1.8,  R: -4.5, N: -3.5, D: -3.5, C: 2.5,
  Q: -3.5, E: -3.5, G: -0.4, H: -3.2, I: 4.5,
  L: 3.8,  K: -3.9, M: 1.9,  F: 2.8,  P: -1.6,
  S: -0.8, T: -0.7, W: -0.9, Y: -1.3, V: 4.2
};

// Standard pKa values (Bjellqvist / EMBOSS)
export const PKA_VALUES = {
  N_TERM: 9.69,
  C_TERM: 2.34,
  ASP: 3.86,
  GLU: 4.25,
  CYS: 8.33,
  TYR: 10.07,
  HIS: 6.00,
  LYS: 10.53,
  ARG: 12.48
};

// Levitt / Chou-Fasman Secondary Structure Conformational Propensities
export const P_ALPHA: Record<string, number> = {
  E: 1.51, M: 1.45, A: 1.42, L: 1.21, K: 1.16,
  F: 1.13, Q: 1.11, W: 1.08, I: 1.08, V: 1.06,
  D: 1.01, H: 1.00, R: 0.98, T: 0.83, S: 0.77,
  C: 0.70, Y: 0.69, N: 0.67, P: 0.57, G: 0.57
};

export const P_BETA: Record<string, number> = {
  V: 1.70, I: 1.60, Y: 1.47, F: 1.38, W: 1.37,
  L: 1.30, C: 1.19, T: 1.19, Q: 1.10, M: 1.05,
  R: 0.93, N: 0.89, H: 0.87, A: 0.83, S: 0.75,
  G: 0.75, K: 0.74, P: 0.55, D: 0.54, E: 0.37
};

export const P_TURN: Record<string, number> = {
  N: 1.56, P: 1.52, G: 1.56, D: 1.46, S: 1.43,
  C: 1.19, Y: 1.14, K: 1.01, T: 0.96, W: 0.96,
  R: 0.95, H: 0.95, Q: 0.98, E: 0.74, A: 0.66,
  M: 0.60, F: 0.60, L: 0.59, V: 0.50, I: 0.47
};

// Novotny-Chothia accessible surface area in unfolded tripeptide Gly-X-Gly (Å²)
export const NOMINAL_SASA: Record<string, number> = {
  A: 115, R: 225, N: 160, D: 150, C: 135,
  Q: 180, E: 190, G: 75,  H: 195, I: 175,
  L: 170, K: 200, M: 185, F: 210, P: 145,
  S: 115, T: 140, W: 255, Y: 230, V: 155
};

// Bahadur / Levy Statistical Protein-Protein Interface Propensities
// (Enrichment factor at PPI interfaces relative to monomer surfaces)
export const PPI_INTERFACE_PROPENSITY: Record<string, number> = {
  W: 1.48, Y: 1.41, R: 1.32, F: 1.22, L: 1.16,
  H: 1.15, I: 1.12, M: 1.10, V: 1.05, P: 1.02,
  C: 0.98, Q: 0.94, E: 0.90, N: 0.87, K: 0.86,
  T: 0.85, S: 0.81, D: 0.77, A: 0.73, G: 0.66
};

// Vihinen Flexibility Index (1994)
export const VIHINEN_FLEXIBILITY: Record<string, number> = {
  G: 1.031, S: 1.017, D: 1.007, E: 1.002, P: 0.997,
  A: 0.997, K: 0.999, Q: 0.998, N: 1.002, T: 0.997,
  R: 0.991, H: 0.986, C: 0.985, V: 0.986, M: 0.982,
  I: 0.976, L: 0.978, Y: 0.976, F: 0.970, W: 0.966
};

// Guruprasad Instability Index Dipeptide Weighting sample constants
// (Guruprasad et al. 1990)
const DIWV_COMMON: Record<string, number> = {
  'WW': 1.0, 'WR': 24.68, 'ED': -14.03, 'EE': 33.60, 'MM': -1.88,
  'DD': -14.03, 'GG': 13.34, 'CC': 44.94, 'PP': 20.26, 'KK': 1.0
};

export interface SingleChainDescriptors {
  length: number;
  molecularWeight: number; // Daltons
  aac: Record<string, number>; // fractions 0-1
  hydropathyMean: number;
  netChargePH74: number;
  isoelectricPoint: number;
  aromaticity: number; // fraction Phe + Trp + Tyr
  aliphaticIndex: number;
  instabilityIndex: number;
  predictedSasaTotal: number; // Å²
  sasaHydrophobicFraction: number;
  sasaPolarFraction: number;
  radiusGyrationEst: number; // Å
  pAlphaMean: number;
  pBetaMean: number;
  pTurnMean: number;
  interfacePropensityMean: number;
  flexibilityMean: number;
}

export interface PairwiseDescriptors {
  chainA: SingleChainDescriptors;
  chainB: SingleChainDescriptors;
  allFeatures: Record<string, number>;
}

/**
 * Calculates net electrical charge of a polypeptide at a given pH
 * using the Henderson-Hasselbalch equation.
 */
export function calculateNetCharge(seq: string, pH: number): number {
  let charge = 0;

  // N-terminus (+1 when protonated)
  charge += 1.0 / (1.0 + Math.pow(10, pH - PKA_VALUES.N_TERM));

  // C-terminus (-1 when deprotonated)
  charge -= 1.0 / (1.0 + Math.pow(10, PKA_VALUES.C_TERM - pH));

  for (const aa of seq) {
    switch (aa) {
      case 'D':
        charge -= 1.0 / (1.0 + Math.pow(10, PKA_VALUES.ASP - pH));
        break;
      case 'E':
        charge -= 1.0 / (1.0 + Math.pow(10, PKA_VALUES.GLU - pH));
        break;
      case 'C':
        charge -= 1.0 / (1.0 + Math.pow(10, PKA_VALUES.CYS - pH));
        break;
      case 'Y':
        charge -= 1.0 / (1.0 + Math.pow(10, PKA_VALUES.TYR - pH));
        break;
      case 'H':
        charge += 1.0 / (1.0 + Math.pow(10, pH - PKA_VALUES.HIS));
        break;
      case 'K':
        charge += 1.0 / (1.0 + Math.pow(10, pH - PKA_VALUES.LYS));
        break;
      case 'R':
        charge += 1.0 / (1.0 + Math.pow(10, pH - PKA_VALUES.ARG));
        break;
      default:
        break;
    }
  }

  return charge;
}

/**
 * Calculates isoelectric point (pI) using iterative bisection algorithm.
 */
export function calculateIsoelectricPoint(seq: string): number {
  let minPH = 2.0;
  let maxPH = 13.0;
  let pI = 7.0;

  for (let iter = 0; iter < 20; iter++) {
    pI = (minPH + maxPH) / 2.0;
    const currentCharge = calculateNetCharge(seq, pI);

    if (Math.abs(currentCharge) < 0.005) {
      break;
    }

    if (currentCharge > 0) {
      minPH = pI;
    } else {
      maxPH = pI;
    }
  }

  return Math.round(pI * 100) / 100;
}

/**
 * Calculates Instability Index (Guruprasad et al., 1990).
 */
export function calculateInstabilityIndex(seq: string): number {
  if (seq.length < 2) return 0;
  let sum = 0;
  for (let i = 0; i < seq.length - 1; i++) {
    const pair = seq[i] + seq[i + 1];
    sum += DIWV_COMMON[pair] || 1.0;
  }
  const score = (10.0 / seq.length) * sum;
  return Math.max(0, Math.round(score * 100) / 100);
}

/**
 * Extracts single chain biochemical and predicted structural descriptors.
 */
export function extractSingleChainDescriptors(parsed: ParsedSequence): SingleChainDescriptors {
  const seq = parsed.cleanedSequence;
  const L = seq.length;

  // Amino Acid Composition fractions
  const aac: Record<string, number> = {};
  const standardAAs = Object.keys(KYTE_DOOLITTLE);
  for (const aa of standardAAs) {
    aac[aa] = (parsed.composition[aa] || 0) / L;
  }

  // Hydropathy
  let hydropathySum = 0;
  let pAlphaSum = 0;
  let pBetaSum = 0;
  let pTurnSum = 0;
  let interfacePropSum = 0;
  let flexSum = 0;
  let nominalSasaSum = 0;
  let hydrophobicSasaSum = 0;
  let polarSasaSum = 0;

  const hydrophobicAAs = new Set(['A', 'V', 'I', 'L', 'M', 'F', 'W', 'P', 'C']);

  for (const aa of seq) {
    hydropathySum += KYTE_DOOLITTLE[aa] ?? 0;
    pAlphaSum += P_ALPHA[aa] ?? 1.0;
    pBetaSum += P_BETA[aa] ?? 1.0;
    pTurnSum += P_TURN[aa] ?? 1.0;
    interfacePropSum += PPI_INTERFACE_PROPENSITY[aa] ?? 1.0;
    flexSum += VIHINEN_FLEXIBILITY[aa] ?? 0.99;

    const sasa = NOMINAL_SASA[aa] ?? 140;
    nominalSasaSum += sasa;
    if (hydrophobicAAs.has(aa)) {
      hydrophobicSasaSum += sasa;
    } else {
      polarSasaSum += sasa;
    }
  }

  const hydropathyMean = hydropathySum / L;
  const pAlphaMean = pAlphaSum / L;
  const pBetaMean = pBetaSum / L;
  const pTurnMean = pTurnSum / L;
  const interfacePropensityMean = interfacePropSum / L;
  const flexibilityMean = flexSum / L;

  // Net Charge & pI
  const netChargePH74 = calculateNetCharge(seq, 7.4);
  const isoelectricPoint = calculateIsoelectricPoint(seq);

  // Aromaticity
  const aromaticity = aac['F'] + aac['W'] + aac['Y'];

  // Aliphatic Index (Ikai, 1980)
  const aliphaticIndex = 100 * (aac['A'] + 2.9 * aac['V'] + 3.9 * (aac['I'] + aac['L']));

  // Instability Index
  const instabilityIndex = calculateInstabilityIndex(seq);

  // Predicted SASA: Chothia power-law scaling for monomer globule
  // SASA_globular ≈ 6.3 * L^0.73 * 100 Å²
  const predictedSasaTotal = 6.3 * Math.pow(L, 0.73) * 10.0;
  const sasaHydrophobicFraction = nominalSasaSum > 0 ? hydrophobicSasaSum / nominalSasaSum : 0.45;
  const sasaPolarFraction = nominalSasaSum > 0 ? polarSasaSum / nominalSasaSum : 0.55;

  // Radius of gyration Rg scaling: Rg ≈ 2.82 * L^0.392 Å
  const radiusGyrationEst = 2.82 * Math.pow(L, 0.392);

  return {
    length: L,
    molecularWeight: parsed.molecularWeightEstimated,
    aac,
    hydropathyMean,
    netChargePH74,
    isoelectricPoint,
    aromaticity,
    aliphaticIndex,
    instabilityIndex,
    predictedSasaTotal,
    sasaHydrophobicFraction,
    sasaPolarFraction,
    radiusGyrationEst,
    pAlphaMean,
    pBetaMean,
    pTurnMean,
    interfacePropensityMean,
    flexibilityMean
  };
}

/**
 * Extracts complete pair descriptors, pairing features, and class-specific inputs.
 */
export function extractPairwiseDescriptors(
  parsedA: ParsedSequence,
  parsedB: ParsedSequence
): PairwiseDescriptors {
  const chainA = extractSingleChainDescriptors(parsedA);
  const chainB = extractSingleChainDescriptors(parsedB);

  const allFeatures: Record<string, number> = {};

  // Single chain references
  allFeatures['protA_length'] = chainA.length;
  allFeatures['protB_length'] = chainB.length;
  allFeatures['protA_charge'] = chainA.netChargePH74;
  allFeatures['protB_charge'] = chainB.netChargePH74;
  allFeatures['protA_hydropathy'] = chainA.hydropathyMean;
  allFeatures['protB_hydropathy'] = chainB.hydropathyMean;
  allFeatures['protA_aromaticity'] = chainA.aromaticity;
  allFeatures['protB_aromaticity'] = chainB.aromaticity;
  allFeatures['protA_secondary_alpha'] = chainA.pAlphaMean;

  // Pairwise composite and differential features
  allFeatures['pair_length_log_ratio'] = Math.log10(chainA.length / chainB.length);
  allFeatures['pair_hydropathy_mean'] = 0.5 * (chainA.hydropathyMean + chainB.hydropathyMean);
  allFeatures['pair_hydropathy_delta'] = Math.abs(chainA.hydropathyMean - chainB.hydropathyMean);
  allFeatures['pair_charge_product'] = chainA.netChargePH74 * chainB.netChargePH74;
  allFeatures['pair_charge_diff'] = Math.abs(chainA.netChargePH74 - chainB.netChargePH74);
  allFeatures['pair_isoelectric_point_diff'] = Math.abs(chainA.isoelectricPoint - chainB.isoelectricPoint);
  allFeatures['pair_aromaticity_mean'] = 0.5 * (chainA.aromaticity + chainB.aromaticity);
  allFeatures['pair_aliphatic_index_mean'] = 0.5 * (chainA.aliphaticIndex + chainB.aliphaticIndex);
  allFeatures['pair_instability_mean'] = 0.5 * (chainA.instabilityIndex + chainB.instabilityIndex);
  allFeatures['predicted_interface_propensity_mean'] = 0.5 * (chainA.interfacePropensityMean + chainB.interfacePropensityMean);
  allFeatures['sasa_hydrophobic_fraction_mean'] = 0.5 * (chainA.sasaHydrophobicFraction + chainB.sasaHydrophobicFraction);
  allFeatures['sasa_polar_fraction_mean'] = 0.5 * (chainA.sasaPolarFraction + chainB.sasaPolarFraction);
  allFeatures['sasa_total_estimated_mean'] = 0.5 * (chainA.predictedSasaTotal + chainB.predictedSasaTotal);
  allFeatures['pair_secondary_alpha_mean'] = 0.5 * (chainA.pAlphaMean + chainB.pAlphaMean);
  allFeatures['pair_secondary_beta_mean'] = 0.5 * (chainA.pBetaMean + chainB.pBetaMean);
  allFeatures['pair_secondary_coil_mean'] = 0.5 * (chainA.pTurnMean + chainB.pTurnMean);
  allFeatures['pair_molecular_weight_ratio'] = Math.max(chainA.molecularWeight, chainB.molecularWeight) / Math.max(1, Math.min(chainA.molecularWeight, chainB.molecularWeight));
  allFeatures['predicted_radius_gyration_ratio'] = Math.max(chainA.radiusGyrationEst, chainB.radiusGyrationEst) / Math.max(0.1, Math.min(chainA.radiusGyrationEst, chainB.radiusGyrationEst));
  allFeatures['pair_flexibility_index_mean'] = 0.5 * (chainA.flexibilityMean + chainB.flexibilityMean);

  // Amino acid frequencies (percentages 0-100)
  allFeatures['pair_tyrosine_mean'] = 0.5 * (chainA.aac['Y'] + chainB.aac['Y']) * 100;
  allFeatures['pair_tryptophan_mean'] = 0.5 * (chainA.aac['W'] + chainB.aac['W']) * 100;
  allFeatures['pair_arginine_mean'] = 0.5 * (chainA.aac['R'] + chainB.aac['R']) * 100;
  allFeatures['pair_lysine_mean'] = 0.5 * (chainA.aac['K'] + chainB.aac['K']) * 100;
  allFeatures['pair_glutamate_mean'] = 0.5 * (chainA.aac['E'] + chainB.aac['E']) * 100;
  allFeatures['pair_cysteine_mean'] = 0.5 * (chainA.aac['C'] + chainB.aac['C']) * 100;
  allFeatures['pair_proline_mean'] = 0.5 * (chainA.aac['P'] + chainB.aac['P']) * 100;
  allFeatures['pair_glycine_delta'] = Math.abs(chainA.aac['G'] - chainB.aac['G']) * 100;
  allFeatures['pair_serine_threonine_mean'] = 0.5 * ((chainA.aac['S'] + chainA.aac['T']) + (chainB.aac['S'] + chainB.aac['T'])) * 100;

  return {
    chainA,
    chainB,
    allFeatures
  };
}
