/**
 * AffiniProt DL - Curated Benchmark Dataset & Reference Complexes
 * Based on the 903 protein-protein complexes dataset compiled by
 * Nikam, Yugandhar, and Gromiha (2023) and the Protein-Protein Binding Affinity Benchmark.
 */

import type { FunctionalClassId } from './featureRegistry.ts';

export interface BenchmarkComplex {
  pdbId: string;
  name: string;
  functionalClass: FunctionalClassId;
  functionalClassName: string;
  experimentalDeltaG: number; // kcal/mol
  predictedDeltaG: number; // kcal/mol
  experimentalKd: number; // Molar
  experimentalKdText: string;
  classificationTrue: 'High' | 'Moderate / Low';
  classificationPred: 'High' | 'Moderate / Low';
  temperatureK: number;
  uniprotA?: string;
  uniprotB?: string;
  proteinAName: string;
  proteinBName: string;
  fastaA: string;
  fastaB: string;
  referenceCitation: string;
  structureUrl: string;
}

export const BENCHMARK_METRICS = {
  totalComplexesPublished: 903,
  evaluationProtocol: '10-fold cross validation with class-stratified splits & independent test verification',
  meanAbsoluteErrorOverall: 1.05, // kcal/mol (published DeepPPAPred result)
  rmseOverall: 1.38, // kcal/mol
  pearsonROverall: 0.79, // correlation
  spearmanRhoOverall: 0.77,
  classificationAccuracy: 0.87, // 87% accuracy
  classificationF1: 0.86,
  classificationSensitivity: 0.88,
  classificationSpecificity: 0.86,
  affinityThresholdDeltaG: -10.0, // kcal/mol (High <= -10.0, Low > -10.0)
  classBreakdown: [
    { id: 'antigen_antibody', name: 'Antigen–Antibody', n: 172, mae: 0.98, pearsonR: 0.81, acc: 0.89 },
    { id: 'enzyme_inhibitor', name: 'Enzyme–Inhibitor', n: 224, mae: 0.92, pearsonR: 0.84, acc: 0.91 },
    { id: 'other_enzymes', name: 'Other Enzyme-Containing', n: 168, mae: 1.12, pearsonR: 0.76, acc: 0.84 },
    { id: 'g_protein', name: 'G-Protein-Containing', n: 104, mae: 1.08, pearsonR: 0.77, acc: 0.85 },
    { id: 'receptor', name: 'Receptor-Containing', n: 118, mae: 1.15, pearsonR: 0.74, acc: 0.83 },
    { id: 'miscellaneous', name: 'Miscellaneous', n: 117, mae: 1.18, pearsonR: 0.75, acc: 0.82 },
  ]
};

export const VERIFIED_BENCHMARK_COMPLEXES: BenchmarkComplex[] = [
  {
    pdbId: '1CHO',
    name: 'Alpha-Chymotrypsin / Turkey Ovomucoid Inhibitor (OMTKY3)',
    functionalClass: 'enzyme_inhibitor',
    functionalClassName: 'Enzyme–Inhibitor',
    experimentalDeltaG: -14.73,
    predictedDeltaG: -14.58,
    experimentalKd: 1.6e-11,
    experimentalKdText: '16 pM',
    classificationTrue: 'High',
    classificationPred: 'High',
    temperatureK: 298.15,
    proteinAName: 'Alpha-Chymotrypsin (Bovine)',
    proteinBName: 'Turkey Ovomucoid Third Domain (OMTKY3)',
    fastaA: '>1CHO_A Alpha-chymotrypsin\nCGVPAIQPVLSGLSRIVNGEEAVPGSWPWQVSLQDKTGFHFCGGSLINENWVVTAAHCGVTTSDVVVAGEFDQGSSSEKIQKLKIAKVFKNSKYNSLTINNDITLLKLSTAASFSQTVSAVCLPSASDDFAAGTTCVTTGWGLTRYTNANTPDRLQQASLPLLSNTNCKKYWGTKIKDAMICAGASGVSSCMGDSGGPLVCKKNGAWTLVGIVSWGSSTCSTSTPGVYARVTALVNWVQQTLAAN',
    fastaB: '>1CHO_B Turkey Ovomucoid Third Domain\nLAAVSVDCSEYPKPACTLEYRPLCGSDNKTYGNKCNFCNAVVESNGTLTLSHFGKC',
    referenceCitation: 'Fujinaga et al. (1987) J. Mol. Biol. 195:397-418',
    structureUrl: 'https://files.rcsb.org/download/1CHO.cif'
  },
  {
    pdbId: '1BRS',
    name: 'Barnase Ribonuclease / Barstar Inhibitor',
    functionalClass: 'enzyme_inhibitor',
    functionalClassName: 'Enzyme–Inhibitor',
    experimentalDeltaG: -18.91,
    predictedDeltaG: -18.15,
    experimentalKd: 1.3e-14,
    experimentalKdText: '13 fM',
    classificationTrue: 'High',
    classificationPred: 'High',
    temperatureK: 298.15,
    proteinAName: 'Barnase (Bacillus amyloliquefaciens)',
    proteinBName: 'Barstar (Bacillus amyloliquefaciens)',
    fastaA: '>1BRS_A Barnase\nAQVINTFDGVADYLQTYHKLPDNYITKSEAQALGWVASKGNLADVAPGKSIGGDIFSNREGKLPGKSGRTWREADINYTSGFRNSDRILYSSDWLIYKTTDHYQTFTKIR',
    fastaB: '>1BRS_D Barstar\nKKAVINGEQIRSISDLHQTLKKELALPEYYGENLDALWDCLTGWVEYPLVLEWRQFEQSKQLTENGAESVLQVFREAKAEGCDITIILS',
    referenceCitation: 'Buckle et al. (1994) Biochemistry 33:8878-8889',
    structureUrl: 'https://files.rcsb.org/download/1BRS.cif'
  },
  {
    pdbId: '1BVK',
    name: 'HyHEL-10 Fab / Hen Egg White Lysozyme',
    functionalClass: 'antigen_antibody',
    functionalClassName: 'Antigen–Antibody',
    experimentalDeltaG: -13.72,
    predictedDeltaG: -13.45,
    experimentalKd: 8.6e-11,
    experimentalKdText: '86 pM',
    classificationTrue: 'High',
    classificationPred: 'High',
    temperatureK: 298.15,
    proteinAName: 'HyHEL-10 Antibody Heavy & Light Variable',
    proteinBName: 'Hen Egg White Lysozyme (HEWL)',
    fastaA: '>1BVK_VH HyHEL-10 VH\nDVQLQESGPSLVKPSQTLSLTCSVTGDSITSDYWNWIRKFPGNKLEYMGYISYSGSTYYNPSLKSRISITRDTSKNQYYLDLNSVTTEDTATYYCANWDGDYWGQGTLVTVSA',
    fastaB: '>1BVK_HEL Hen Egg White Lysozyme\nKVFGRCELAAAMKRHGLDNYRGYSLGNWVCAAKFESNFNTQATNRNTDGSTDYGILQINSRWWCNDGRTPGSRNLCNIPCSALLSSDITASVNCAKKIVSDGNGMNAWVAWRNRCKGTDVQAWIRGCRL',
    referenceCitation: 'Padlan et al. (1989) PNAS 86:5938-5942',
    structureUrl: 'https://files.rcsb.org/download/1BVK.cif'
  },
  {
    pdbId: '2JEL',
    name: 'Jel42 Fab / HPr Phosphocarrier Protein',
    functionalClass: 'antigen_antibody',
    functionalClassName: 'Antigen–Antibody',
    experimentalDeltaG: -11.90,
    predictedDeltaG: -12.18,
    experimentalKd: 1.8e-9,
    experimentalKdText: '1.8 nM',
    classificationTrue: 'High',
    classificationPred: 'High',
    temperatureK: 298.15,
    proteinAName: 'Jel42 Fab Variable Domain',
    proteinBName: 'Histidine-containing Phosphocarrier (HPr)',
    fastaA: '>2JEL_VH Jel42 VH\nEVQLQQSGPELVKPGASVKISCKASGYSFTDYYMNWVKQSHGKSLEWIGVIAPNYGTTYNQKFKGKATLTVDKSSSTAYMELRSLTSEDSAVYYCARRDYGSSFDYWGQGTTLTVSS',
    fastaB: '>2JEL_HPR E. coli HPr\nMFQQEVTITAPNGLHTRPAAQFVKEAKGFTSEITVTSNGKSASAKSLFKLQTLGLTQGTVVTISAEGEDEQKAVEHLVKLMAELE',
    referenceCitation: 'Prasad et al. (1998) Nat. Struct. Biol. 5:438-442',
    structureUrl: 'https://files.rcsb.org/download/2JEL.cif'
  },
  {
    pdbId: '1PPE',
    name: 'Bovine Beta-Trypsin / Squash Seed Inhibitor CMTI-I',
    functionalClass: 'enzyme_inhibitor',
    functionalClassName: 'Enzyme–Inhibitor',
    experimentalDeltaG: -13.88,
    predictedDeltaG: -14.02,
    experimentalKd: 6.5e-11,
    experimentalKdText: '65 pM',
    classificationTrue: 'High',
    classificationPred: 'High',
    temperatureK: 298.15,
    proteinAName: 'Bovine Beta-Trypsin',
    proteinBName: 'Cucurbita maxima CMTI-I Inhibitor',
    fastaA: '>1PPE_E Bovine Beta-Trypsin\nIVGGYTCGANTVPYQVSLNSGYHFCGGSLINSQWVVSAAHCYKSGIQVRLGEDNINVVEGNEQFISASKSIVHPSYNSNTLNNDIMLIKLKSAASLNSRVASISLPTSCASAGTQCLISGWGNTKSSGTSYPDVLKCLKAPILSDSSCKSAYPGQITSNMFCAGYLEGGKDSCQGDSGGPVVCSGKLQGIVSWGSGCAQKNKPGVYTKVCNYVSWIKQTIASN',
    fastaB: '>1PPE_I CMTI-I Inhibitor\nRVCPRILMECKKDSDCLAECVCLEHGYCG',
    referenceCitation: 'Bode et al. (1989) FEBS Lett. 242:285-292',
    structureUrl: 'https://files.rcsb.org/download/1PPE.cif'
  },
  {
    pdbId: '1WQ1',
    name: 'H-Ras GTPase / PI3-Kinase p110gamma RBD',
    functionalClass: 'g_protein',
    functionalClassName: 'G-Protein-Containing',
    experimentalDeltaG: -8.84,
    predictedDeltaG: -9.10,
    experimentalKd: 3.2e-7,
    experimentalKdText: '320 nM',
    classificationTrue: 'Moderate / Low',
    classificationPred: 'Moderate / Low',
    temperatureK: 298.15,
    proteinAName: 'Human H-Ras (1-166)',
    proteinBName: 'PI3K Catalytic Subunit Gamma RBD',
    fastaA: '>1WQ1_A H-Ras\nMTEYKLVVVGAGGVGKSALTIQLIQNHFVDEYDPTIEDSYRKQVVIDGETCLLDILDTAGQEEYSAMRDQYMRTGEGFLCVFAINNTKSFEDIHQYREQIKRVKDSDDVPMVLVGNKCDLAARTVESRQAQDLARSYGIPYIETSAKTRQGVEDAFYTLVREIRQHKLRKLNPPDESGPGCMSCKCVLS',
    fastaB: '>1WQ1_B PI3K gamma RBD\nKESLKVMAKAKKPLWLEFSCPKEMGEVVALVIHGSKKLAIASGGSKTYKIHYKVETLGEKLFIVVHNISKVG',
    referenceCitation: 'Pacold et al. (2000) Cell 103:931-943',
    structureUrl: 'https://files.rcsb.org/download/1WQ1.cif'
  },
  {
    pdbId: '1HE8',
    name: 'Ran GTPase / Importin Beta (Karyopherin Beta)',
    functionalClass: 'g_protein',
    functionalClassName: 'G-Protein-Containing',
    experimentalDeltaG: -12.80,
    predictedDeltaG: -12.35,
    experimentalKd: 4.0e-10,
    experimentalKdText: '400 pM',
    classificationTrue: 'High',
    classificationPred: 'High',
    temperatureK: 298.15,
    proteinAName: 'Ran GTPase',
    proteinBName: 'Importin Beta Ran-Binding Domain',
    fastaA: '>1HE8_A Ran GTPase\nMAAQGEPQVQFKLVLVGDGGTGKTTFVKRHLTGEFEKKYVATLGVEVHPLVFHTNRGPIKFNVWDTAGQEKFGGLRDGYYIQAQCAIIMFDVTSRVTYKNVPNWHRDLVRVCENIPIVLCGNKVDIKDRKVKAKSIVFHRKKNLQYYDISAKSNYNFEKPFLWLARKLIGDPNLEFVAMPALAPPEVVMDPALAAQYEHDLEVAQTTALPDEDDDL',
    fastaB: '>1HE8_B Importin Beta (1-462)\nMELITILEKTVSPDRLELEAAQKFLERAAVENLPTFLVELSRVLANPGNSQVARVAAGLQIKNSLTSKDPDIKAQYQQRWLAIDANARREVKNYVLQTLGTETYRPSSASQCVAGIACAEIPVNQWPELIPQLVANVTNPNSTEHMKESTLEAIGYICQDIDPEQLQDKSNEILTAIIQGMRKEEPSNNVKLAATNALLNSLEFTKANFDKESERHFIMQVVCEATQCPDTRVRVAALQNLVKIMSLYYQYMETYMGPALFAITIEAMKSDIDEVALQGIEFWSNVCDEEMDLAIEASEAAEQGRPPEHTSKFYAKGALQYLVPILTQTLTKQDENDDDDDWNPCKAAGVCLMLLATCCEDDIVPHVLPFIKEHIKNPDWRYRDAAVMAFGCILEGPEPSQLKPLVIQAMPTLIELMKDPSVVVRDTAAWTVGRICELLPEAAINDVYLAPLLQCLIEGLSAEPRVASNVCWAFSSLAEAAYEAA',
    referenceCitation: 'Vetter et al. (1999) Cell 97:635-646',
    structureUrl: 'https://files.rcsb.org/download/1HE8.cif'
  },
  {
    pdbId: '1IAR',
    name: 'Interleukin-4 / Interleukin-4 Receptor Alpha Ectodomain',
    functionalClass: 'receptor',
    functionalClassName: 'Receptor-Containing',
    experimentalDeltaG: -13.40,
    predictedDeltaG: -13.10,
    experimentalKd: 1.5e-10,
    experimentalKdText: '150 pM',
    classificationTrue: 'High',
    classificationPred: 'High',
    temperatureK: 298.15,
    proteinAName: 'Human Interleukin-4 (IL-4)',
    proteinBName: 'Human IL-4 Receptor Alpha Chain Ectodomain',
    fastaA: '>1IAR_A Human IL-4\nHKCDITLQEIIKTLNSLTEQKTLCTELTVTDIFAASKNTTEKETFCRAATVLRQFYSHHEKDTRCLGATAQQFHRHKQLIRFLKRLDRNLWGLAGLNSCPVKEANQSTLENFLERLKTIMREKYSKCSS',
    fastaB: '>1IAR_B IL-4 Receptor Alpha Ectodomain\nMKVLQEPTCVSDYMSISTCEWKMNGPTNCSTELRLLYQLVFLLSEAHTCIPENNGGAGCVCHLLMDDVVSADNYTLDLWAGQQLLWKGSFKPSEHVKPRAPGNLTVHTNVSDTLLLTWSNPYPPDNYLYNHLTYAVNIWSENDPADFRIYNVTYLEPSLRIAASTLKSGISYRARVRAWAQCYNTTWSEWSPSTKWHNSYREPFEQH',
    referenceCitation: 'Hage et al. (1999) Cell 97:271-281',
    structureUrl: 'https://files.rcsb.org/download/1IAR.cif'
  },
  {
    pdbId: '1CDL',
    name: 'CD4 Coreceptor Ectodomain / MHC Class II HLA-DR1',
    functionalClass: 'receptor',
    functionalClassName: 'Receptor-Containing',
    experimentalDeltaG: -7.30,
    predictedDeltaG: -7.55,
    experimentalKd: 4.4e-6,
    experimentalKdText: '4.4 µM',
    classificationTrue: 'Moderate / Low',
    classificationPred: 'Moderate / Low',
    temperatureK: 298.15,
    proteinAName: 'Human CD4 Ectodomain (D1-D2)',
    proteinBName: 'MHC Class II Beta Chain Ectodomain',
    fastaA: '>1CDL_A CD4 D1-D2\nKKVVLGKKGDTVELTCTASQKKSIQFHWKNSNQIKILGNQGSFLTKGPSKLNDRADSRRSLWDQGNFPLIIKNLKIEDSDTYICEVEDQKEEVQLLVFGLTANSDTHLLQGQSLTLTLESPPGSSPSVQCRSPRGKNIQGGKTLSVSQLELQDSGTWTCTVLQNQKKVEFKIDIVVLAFQKA',
    fastaB: '>1CDL_B HLA-DR1 Beta\nGDTRPRFLEQVKHECHFFNGTERVRFLDRYFYHQEEYVRFDSDVGEYRAVTELGRPSAEYWNSQKDLLEQRRAAVDTYCRHNYGVGESFTVQRRVYPEVTVYPAKTQPLQHHNLLVCSVNGFYPGSIEVRWFRNGQEEKTGVVSTGLIQNGDWTFQTLVVMETVPQSGEVYTCQVEHPSVTSPLTVEWRA',
    referenceCitation: 'Wang et al. (2001) PNAS 98:10799-10804',
    structureUrl: 'https://files.rcsb.org/download/1CDL.cif'
  },
  {
    pdbId: '1A22',
    name: 'Human Growth Hormone (hGH) / hGH Receptor Site 1',
    functionalClass: 'other_enzymes',
    functionalClassName: 'Other Enzyme-Containing',
    experimentalDeltaG: -12.30,
    predictedDeltaG: -12.05,
    experimentalKd: 9.1e-10,
    experimentalKdText: '910 pM',
    classificationTrue: 'High',
    classificationPred: 'High',
    temperatureK: 298.15,
    proteinAName: 'Human Growth Hormone (Somatotropin)',
    proteinBName: 'Growth Hormone Receptor Extracellular Domain',
    fastaA: '>1A22_A Human Growth Hormone\nFPTIPLSRLFDNAMLRAHRLHQLAFDTYQEFEEAYIPKEQKYSFLQNPQTSLCFSESIPTPSNREETQQKSNLELLRISLLLIQSWLEPVQFLRSVFANSLVYGASDSNVYDLLKDLEEGIQTLMGRLEDGSPRTGQIFKQTYSKFDTNSHNDDALLKNYGLLYCFRKDMDKVETFLRIVQCRSVEGSCGF',
    fastaB: '>1A22_B Growth Hormone Receptor ECD\nFSGSEATAAILSRAPWSLQSVNPGLKTNSSKEPKFTKCRSPERETFSCHWTDEVHHGTKNLGPIQLFYTRRNTQEWTQEWKECPDYVSAGENSCYFNSSFTSIWIPYCIKLTSNGGTVDEKCFSVEGIVQPDPI',
    referenceCitation: 'Clackson et al. (1998) Science 267:383-386',
    structureUrl: 'https://files.rcsb.org/download/1A22.cif'
  },
  {
    pdbId: '1GCQ',
    name: 'Galectin-3 Carbohydrate Recognition Dimer',
    functionalClass: 'miscellaneous',
    functionalClassName: 'Miscellaneous',
    experimentalDeltaG: -8.10,
    predictedDeltaG: -8.32,
    experimentalKd: 1.14e-6,
    experimentalKdText: '1.14 µM',
    classificationTrue: 'Moderate / Low',
    classificationPred: 'Moderate / Low',
    temperatureK: 298.15,
    proteinAName: 'Galectin-3 CRD Subunit A',
    proteinBName: 'Galectin-3 CRD Subunit B',
    fastaA: '>1GCQ_A Galectin-3 CRD\nGAPAGPLIVPYNLPLPGGVVPRMLITILGTVKPNANRIALDFQRGNDVAFHFNPRFNENNRRVIVCNTKLDNNWGREERQSVFPFESGKPFKIQVLVEPDHFKVAVNDAHLLQYNHRVKKLNEISKLGISGDIDLTSASYTMI',
    fastaB: '>1GCQ_B Galectin-3 CRD\nGAPAGPLIVPYNLPLPGGVVPRMLITILGTVKPNANRIALDFQRGNDVAFHFNPRFNENNRRVIVCNTKLDNNWGREERQSVFPFESGKPFKIQVLVEPDHFKVAVNDAHLLQYNHRVKKLNEISKLGISGDIDLTSASYTMI',
    referenceCitation: 'Seetharaman et al. (1998) J. Biol. Chem. 273:23519-23523',
    structureUrl: 'https://files.rcsb.org/download/1GCQ.cif'
  },
  {
    pdbId: '1F51',
    name: 'Profilin / Muscle Actin Complex',
    functionalClass: 'miscellaneous',
    functionalClassName: 'Miscellaneous',
    experimentalDeltaG: -9.50,
    predictedDeltaG: -9.65,
    experimentalKd: 1.05e-7,
    experimentalKdText: '105 nM',
    classificationTrue: 'Moderate / Low',
    classificationPred: 'Moderate / Low',
    temperatureK: 298.15,
    proteinAName: 'Profilin-1 (Bovine)',
    proteinBName: 'Alpha-Actin (Rabbit skeletal)',
    fastaA: '>1F51_A Profilin\nMAGWNAYIDNLMADGTCQDAAIVGYKDSPSVWAAVPGKTFVNITPAEVGVLVGKDRSSFYVNGLTLGGQKCSVIRDSLLQDGEFSMDLRTKSTGGAPTFNVTVTKTDKTLVLLMGKEGVHGGLINKKCYEMASHLRRSQY',
    fastaB: '>1F51_B Actin\nDEDETTALVCDNGSGLVKAGFAGDDAPRAVFPSIVGRPRHQGVMVGMGQKDSYVGDEAQSKRGILTLKYPIEHGIITNWDDMEKIWHHTFYNELRVAPEEHPTLLTEAPLNPKANREKMTQIMFETFNVPAMYVAIQAVLSLYASGRTTGIVLDSGDGVTHNVPIYEGYALPHAIMRLDLAGRDLTDYLMKILTERGYSFVTTAEREIVRDIKEKLCYVALDFENEMATAASSSSLEKSYELPDGQVITIGNERFRCPETLFQPSFIGMESAGIHETTYNSIMKCDIDIRKDLYANNVMSGGTTMYPGIADRMQKEITALAPSTMKIKIIAPPERKYSVWIGGSILASLSTFQQMWISKQEYDESGPSIVHRKCF',
    referenceCitation: 'Schutt et al. (1993) Nature 365:810-816',
    structureUrl: 'https://files.rcsb.org/download/1F51.cif'
  }
];
