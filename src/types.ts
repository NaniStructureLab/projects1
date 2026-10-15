/**
 * AffiniProt DL - Shared TypeScript Types
 */

import { FunctionalClassId } from './server/featureRegistry.ts';

export type { FunctionalClassId };

export interface ProteinSummary {
  id: string;
  header: string;
  length: number;
  molecularWeight: number; // Daltons
  netCharge: number;
  isoelectricPoint: number;
  hydropathyMean: number;
  aromaticity: number;
  aliphaticIndex: number;
  instabilityIndex: number;
  predictedSasa: number;
  radiusGyrationEst: number;
  composition: Record<string, number>;
}

export interface SelectedFeatureContribution {
  id: string;
  name: string;
  rawVal: number;
  normalizedVal: number;
  weightContribution: number;
}

export interface PredictionPayload {
  success: boolean;
  requestId: string;
  timestamp: string;
  executionDurationMs: number;
  metadata: {
    userIdentifier: string;
    userNotes: string;
    temperatureK: number;
  };
  proteinA: ProteinSummary;
  proteinB: ProteinSummary;
  functionalClass: {
    id: FunctionalClassId;
    name: string;
    code: string;
    description: string;
  };
  prediction: {
    deltaG: number;
    units: string;
    kdMolar: number;
    kdFormatted: string;
    classification: 'High Affinity' | 'Moderate / Low Affinity';
    classificationProbabilityHigh: number;
    classificationThresholdDeltaG: number;
    thermodynamicInterpretation: string;
    modelVersion: string;
    featureCount: number;
    selectedFeatures: SelectedFeatureContribution[];
  };
  warnings: string[];
}

export interface ValidationApiResponse {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  proteinA: {
    id: string;
    header: string;
    length: number;
    molecularWeightEstimated: number;
    composition: Record<string, number>;
  } | null;
  proteinB: {
    id: string;
    header: string;
    length: number;
    molecularWeightEstimated: number;
    composition: Record<string, number>;
  } | null;
  functionalClass: {
    id: FunctionalClassId;
    code: string;
    name: string;
    shortDescription: string;
  } | null;
}

export interface BenchmarkComplexItem {
  pdbId: string;
  name: string;
  functionalClass: FunctionalClassId;
  functionalClassName: string;
  experimentalDeltaG: number;
  predictedDeltaG: number;
  experimentalKd: number;
  experimentalKdText: string;
  classificationTrue: 'High' | 'Moderate / Low';
  classificationPred: 'High' | 'Moderate / Low';
  temperatureK: number;
  proteinAName: string;
  proteinBName: string;
  fastaA: string;
  fastaB: string;
  referenceCitation: string;
  structureUrl: string;
}
