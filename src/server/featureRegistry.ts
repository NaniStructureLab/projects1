/**
 * AffiniProt DL - Scientific Feature Registry
 * Documents every sequence- and predicted structure-derived descriptor
 * used in the DeepPPAPred-aligned binding affinity prediction engine.
 */

export type FunctionalClassId = 
  | 'antigen_antibody'
  | 'enzyme_inhibitor'
  | 'other_enzymes'
  | 'g_protein'
  | 'receptor'
  | 'miscellaneous';

export interface FunctionalClassMeta {
  id: FunctionalClassId;
  code: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  typicalAffinityRange: string; // kcal/mol
  benchmarkCount: number; // in the 903 complexes dataset
  selectedFeatureIds: string[];
}

export interface FeatureDefinition {
  id: string;
  name: string;
  category: 'AAC' | 'Physicochemical' | 'PredictedStructure' | 'InterfacePotential' | 'PairwiseInteraction';
  scientificMeaning: string;
  inputRequirements: 'Protein A' | 'Protein B' | 'Protein Pair';
  calculationMethod: string;
  softwareDependency: string;
  units: string;
  missingValuePolicy: string;
  expectedDataType: 'float64' | 'int32';
  usedInClasses: FunctionalClassId[];
  isOriginalDeepPPAPredFeature: boolean;
}

export const FUNCTIONAL_CLASSES: Record<FunctionalClassId, FunctionalClassMeta> = {
  antigen_antibody: {
    id: 'antigen_antibody',
    code: 'AB/AG',
    name: 'Antigen–Antibody Complexes',
    shortDescription: 'Immunoglobulin variable domains bound to protein antigens or viral epitopes.',
    detailedDescription: 'Characterized by hypervariable CDR loops interacting with epitopes via enriched aromatic and charged residues (Tyr, Trp, Arg). Interface is typically flat or shallow with high shape complementarity.',
    typicalAffinityRange: '-8.0 to -16.5 kcal/mol',
    benchmarkCount: 172,
    selectedFeatureIds: [
      'pair_aromaticity_mean',
      'pair_tyrosine_mean',
      'pair_tryptophan_mean',
      'pair_charge_product',
      'pair_hydropathy_delta',
      'sasa_polar_fraction_mean',
      'predicted_interface_propensity_mean',
      'pair_instability_mean',
      'protA_aromaticity',
      'protB_aromaticity',
      'pair_arginine_mean',
      'predicted_beta_propensity_mean'
    ]
  },
  enzyme_inhibitor: {
    id: 'enzyme_inhibitor',
    code: 'EI',
    name: 'Enzyme–Inhibitor Complexes',
    shortDescription: 'Catalytic enzymes bound to macromolecular peptide or protein inhibitors.',
    detailedDescription: 'Involves tight active-site occlusion, extensive hydrogen-bonding networks, and buried hydrophobic surfaces (e.g. Trypsin-BPTI). Exhibits the highest binding affinities and negative ΔG values.',
    typicalAffinityRange: '-10.5 to -19.5 kcal/mol',
    benchmarkCount: 224,
    selectedFeatureIds: [
      'pair_hydropathy_mean',
      'pair_aliphatic_index_mean',
      'predicted_interface_propensity_mean',
      'sasa_hydrophobic_fraction_mean',
      'pair_charge_diff',
      'pair_secondary_alpha_mean',
      'pair_molecular_weight_ratio',
      'pair_cysteine_mean',
      'pair_glycine_delta',
      'predicted_radius_gyration_ratio',
      'protB_hydropathy',
      'protA_charge'
    ]
  },
  other_enzymes: {
    id: 'other_enzymes',
    code: 'OE',
    name: 'Other Enzyme-Containing Complexes',
    shortDescription: 'Enzyme–substrate, enzyme–regulator, or multi-subunit enzyme complexes.',
    detailedDescription: 'Regulatory and non-inhibitor enzyme complexes with moderate conformational flexibility and transient association/dissociation cycles.',
    typicalAffinityRange: '-6.5 to -14.0 kcal/mol',
    benchmarkCount: 168,
    selectedFeatureIds: [
      'pair_hydropathy_mean',
      'pair_charge_product',
      'pair_isoelectric_point_diff',
      'pair_secondary_coil_mean',
      'sasa_total_estimated_mean',
      'pair_aliphatic_index_mean',
      'predicted_interface_propensity_mean',
      'pair_proline_mean',
      'pair_length_log_ratio',
      'protA_secondary_alpha'
    ]
  },
  g_protein: {
    id: 'g_protein',
    code: 'GP',
    name: 'G-Protein-Containing Complexes',
    shortDescription: 'Small GTPases (Ras, Rho, Rab) or heterotrimeric G-protein subunits with GAPs, GEFs, or effectors.',
    detailedDescription: 'Switch-region dependent recognition, nucleotide-binding state sensitivity, with flexible loop transitions mediating signal transduction complexes.',
    typicalAffinityRange: '-7.5 to -15.0 kcal/mol',
    benchmarkCount: 104,
    selectedFeatureIds: [
      'pair_charge_product',
      'pair_hydropathy_delta',
      'pair_secondary_alpha_mean',
      'pair_secondary_beta_mean',
      'predicted_interface_propensity_mean',
      'pair_isoelectric_point_diff',
      'pair_flexibility_index_mean',
      'pair_lysine_mean',
      'pair_glutamate_mean',
      'protA_charge',
      'protB_hydropathy'
    ]
  },
  receptor: {
    id: 'receptor',
    code: 'RC',
    name: 'Receptor-Containing Complexes',
    shortDescription: 'Membrane or soluble receptors interacting with protein ligands, cytokines, or hormones.',
    detailedDescription: 'Extracellular ligand-binding domains interacting with cytokines, growth factors, or chemokines, often accompanied by dimerization or oligomerization.',
    typicalAffinityRange: '-7.0 to -14.5 kcal/mol',
    benchmarkCount: 118,
    selectedFeatureIds: [
      'pair_isoelectric_point_diff',
      'pair_charge_product',
      'sasa_polar_fraction_mean',
      'pair_hydropathy_mean',
      'pair_aromaticity_mean',
      'predicted_interface_propensity_mean',
      'pair_secondary_coil_mean',
      'pair_molecular_weight_ratio',
      'protA_hydropathy',
      'protB_charge',
      'pair_serine_threonine_mean'
    ]
  },
  miscellaneous: {
    id: 'miscellaneous',
    code: 'MISC',
    name: 'Miscellaneous Complexes',
    shortDescription: 'Structural, transport, chaperone, transcription factor, and diverse biological complexes.',
    detailedDescription: 'Heterogeneous group of protein complexes encompassing transcription factor assemblies, transport complexes, viral structural capsids, and chaperones.',
    typicalAffinityRange: '-6.0 to -15.0 kcal/mol',
    benchmarkCount: 117,
    selectedFeatureIds: [
      'pair_hydropathy_mean',
      'pair_charge_product',
      'pair_isoelectric_point_diff',
      'pair_aromaticity_mean',
      'predicted_interface_propensity_mean',
      'sasa_hydrophobic_fraction_mean',
      'pair_secondary_alpha_mean',
      'pair_secondary_beta_mean',
      'pair_instability_mean',
      'pair_aliphatic_index_mean',
      'pair_length_log_ratio',
      'protA_charge'
    ]
  }
};

export const FEATURE_REGISTRY: Record<string, FeatureDefinition> = {
  protA_length: {
    id: 'protA_length',
    name: 'Protein A Sequence Length',
    category: 'AAC',
    scientificMeaning: 'Total number of amino acid residues in Protein A chain.',
    inputRequirements: 'Protein A',
    calculationMethod: 'Direct residue count of validated FASTA sequence.',
    softwareDependency: 'AffiniProt FASTA engine',
    units: 'residues',
    missingValuePolicy: 'Fail validation if < 5 residues.',
    expectedDataType: 'int32',
    usedInClasses: ['antigen_antibody', 'enzyme_inhibitor', 'other_enzymes', 'g_protein', 'receptor', 'miscellaneous'],
    isOriginalDeepPPAPredFeature: true
  },
  protB_length: {
    id: 'protB_length',
    name: 'Protein B Sequence Length',
    category: 'AAC',
    scientificMeaning: 'Total number of amino acid residues in Protein B chain.',
    inputRequirements: 'Protein B',
    calculationMethod: 'Direct residue count of validated FASTA sequence.',
    softwareDependency: 'AffiniProt FASTA engine',
    units: 'residues',
    missingValuePolicy: 'Fail validation if < 5 residues.',
    expectedDataType: 'int32',
    usedInClasses: ['antigen_antibody', 'enzyme_inhibitor', 'other_enzymes', 'g_protein', 'receptor', 'miscellaneous'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_length_log_ratio: {
    id: 'pair_length_log_ratio',
    name: 'Length Log Ratio',
    category: 'PairwiseInteraction',
    scientificMeaning: 'Logarithmic ratio of partner lengths log10(Length_A / Length_B), capturing asymmetric versus symmetric complex size.',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'log10(Length_A / Length_B)',
    softwareDependency: 'AffiniProt Pairwise Module',
    units: 'dimensionless',
    missingValuePolicy: 'Impute 0.0 if lengths identical',
    expectedDataType: 'float64',
    usedInClasses: ['other_enzymes', 'miscellaneous'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_hydropathy_mean: {
    id: 'pair_hydropathy_mean',
    name: 'Mean Kyte-Doolittle Hydropathy',
    category: 'Physicochemical',
    scientificMeaning: 'Average Kyte-Doolittle hydropathy across both interacting protein chains, reflecting overall hydrophobicity driving burial upon association.',
    inputRequirements: 'Protein Pair',
    calculationMethod: '0.5 * (Mean_KD_A + Mean_KD_B) using Kyte & Doolittle (1982) scales.',
    softwareDependency: 'AffiniProt Physicochemical Engine',
    units: 'KD scale units (-4.5 to +4.5)',
    missingValuePolicy: 'Recompute from sequence',
    expectedDataType: 'float64',
    usedInClasses: ['enzyme_inhibitor', 'other_enzymes', 'receptor', 'miscellaneous'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_hydropathy_delta: {
    id: 'pair_hydropathy_delta',
    name: 'Hydropathy Asymmetry (|KD_A - KD_B|)',
    category: 'Physicochemical',
    scientificMeaning: 'Absolute difference in hydropathy between Protein A and Protein B, measuring hydrophobic contrast.',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'abs(Mean_KD_A - Mean_KD_B)',
    softwareDependency: 'AffiniProt Physicochemical Engine',
    units: 'KD scale units',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['antigen_antibody', 'g_protein'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_charge_product: {
    id: 'pair_charge_product',
    name: 'Electrostatic Charge Product (Q_A * Q_B)',
    category: 'Physicochemical',
    scientificMeaning: 'Product of net formal charges at pH 7.4. Negative values indicate electrostatic attraction; positive values indicate repulsion.',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'NetCharge(A, pH 7.4) * NetCharge(B, pH 7.4) computed via Henderson-Hasselbalch.',
    softwareDependency: 'AffiniProt Electrostatics Engine',
    units: 'e^2',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['antigen_antibody', 'other_enzymes', 'g_protein', 'receptor', 'miscellaneous'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_charge_diff: {
    id: 'pair_charge_diff',
    name: 'Absolute Charge Difference (|Q_A - Q_B|)',
    category: 'Physicochemical',
    scientificMeaning: 'Absolute difference in net charges at pH 7.4.',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'abs(NetCharge_A - NetCharge_B)',
    softwareDependency: 'AffiniProt Electrostatics Engine',
    units: 'elementary charges (e)',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['enzyme_inhibitor'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_isoelectric_point_diff: {
    id: 'pair_isoelectric_point_diff',
    name: 'Isoelectric Point Difference (|pI_A - pI_B|)',
    category: 'Physicochemical',
    scientificMeaning: 'Absolute difference between calculated isoelectric points of partners, reflecting global charge divergence.',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'abs(pI_A - pI_B) using iterative bisection of charge titration curve.',
    softwareDependency: 'AffiniProt Electrostatics Engine',
    units: 'pH units',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['other_enzymes', 'g_protein', 'receptor', 'miscellaneous'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_aromaticity_mean: {
    id: 'pair_aromaticity_mean',
    name: 'Mean Aromatic Fraction (Phe + Trp + Tyr)',
    category: 'Physicochemical',
    scientificMeaning: 'Combined fraction of aromatic residues, crucial for pi-pi stacking and cation-pi hot spots in PPI interfaces.',
    inputRequirements: 'Protein Pair',
    calculationMethod: '0.5 * (AromaticFrac_A + AromaticFrac_B)',
    softwareDependency: 'AffiniProt Composition Engine',
    units: 'fraction (0 to 1)',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['antigen_antibody', 'receptor', 'miscellaneous'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_aliphatic_index_mean: {
    id: 'pair_aliphatic_index_mean',
    name: 'Mean Aliphatic Index (Ikai 1980)',
    category: 'Physicochemical',
    scientificMeaning: 'Relative volume occupied by aliphatic side chains (Ala, Val, Ile, Leu), indicative of thermal stability and core hydrophobicity.',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'Ikai formula: X(Ala) + 2.9*X(Val) + 3.9*(X(Ile) + X(Leu))',
    softwareDependency: 'AffiniProt Physicochemical Engine',
    units: 'index units',
    missingValuePolicy: '50.0 default',
    expectedDataType: 'float64',
    usedInClasses: ['enzyme_inhibitor', 'other_enzymes', 'miscellaneous'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_instability_mean: {
    id: 'pair_instability_mean',
    name: 'Mean Instability Index (Guruprasad 1990)',
    category: 'Physicochemical',
    scientificMeaning: 'Estimate of in vitro protein stability derived from dipeptide instability weight matrix.',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'Guruprasad dipeptide instability summation / (L - 1)',
    softwareDependency: 'AffiniProt Physicochemical Engine',
    units: 'index units',
    missingValuePolicy: '40.0 default',
    expectedDataType: 'float64',
    usedInClasses: ['antigen_antibody', 'miscellaneous'],
    isOriginalDeepPPAPredFeature: true
  },
  predicted_interface_propensity_mean: {
    id: 'predicted_interface_propensity_mean',
    name: 'Predicted Interface Propensity Score',
    category: 'InterfacePotential',
    scientificMeaning: 'Statistical propensity of sequence residues to participate in protein-protein binding interfaces based on empirical PPI interface composition (Levy / Bahadur potentials).',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'Sum of residue interface propensities / Total length for both chains.',
    softwareDependency: 'AffiniProt Structural Prediction Engine',
    units: 'propensity score',
    missingValuePolicy: '1.0 default',
    expectedDataType: 'float64',
    usedInClasses: ['antigen_antibody', 'enzyme_inhibitor', 'other_enzymes', 'g_protein', 'receptor', 'miscellaneous'],
    isOriginalDeepPPAPredFeature: true
  },
  sasa_hydrophobic_fraction_mean: {
    id: 'sasa_hydrophobic_fraction_mean',
    name: 'Predicted Hydrophobic SASA Fraction',
    category: 'PredictedStructure',
    scientificMeaning: 'Estimated proportion of solvent-accessible surface area contributed by hydrophobic residues in folded monomers.',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'Novotny-Chothia residue surface standards with globularity scaling.',
    softwareDependency: 'AffiniProt Structural Prediction Engine',
    units: 'fraction (0 to 1)',
    missingValuePolicy: '0.45 default',
    expectedDataType: 'float64',
    usedInClasses: ['enzyme_inhibitor', 'miscellaneous'],
    isOriginalDeepPPAPredFeature: true
  },
  sasa_polar_fraction_mean: {
    id: 'sasa_polar_fraction_mean',
    name: 'Predicted Polar SASA Fraction',
    category: 'PredictedStructure',
    scientificMeaning: 'Estimated proportion of solvent-accessible surface area contributed by polar & charged residues.',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'Novotny-Chothia surface standards polar area / total area.',
    softwareDependency: 'AffiniProt Structural Prediction Engine',
    units: 'fraction (0 to 1)',
    missingValuePolicy: '0.55 default',
    expectedDataType: 'float64',
    usedInClasses: ['antigen_antibody', 'receptor'],
    isOriginalDeepPPAPredFeature: true
  },
  sasa_total_estimated_mean: {
    id: 'sasa_total_estimated_mean',
    name: 'Mean Estimated Total SASA (Å²)',
    category: 'PredictedStructure',
    scientificMeaning: 'Total solvent accessible surface area estimated from sequence length and compaction model: SASA ≈ 6.3 * N^0.73 * 100.',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'Chothia/Miller empirical power-law model for globular monomer surfaces.',
    softwareDependency: 'AffiniProt Structural Prediction Engine',
    units: 'Å²',
    missingValuePolicy: 'Recompute from length',
    expectedDataType: 'float64',
    usedInClasses: ['other_enzymes'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_secondary_alpha_mean: {
    id: 'pair_secondary_alpha_mean',
    name: 'Predicted Alpha-Helix Propensity (P_alpha)',
    category: 'PredictedStructure',
    scientificMeaning: 'Mean conformational propensity to form alpha-helices based on Levitt/Chou-Fasman statistical weights.',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'Average P_alpha across both chains.',
    softwareDependency: 'AffiniProt Secondary Structure Engine',
    units: 'propensity scale',
    missingValuePolicy: '1.0 default',
    expectedDataType: 'float64',
    usedInClasses: ['enzyme_inhibitor', 'g_protein', 'miscellaneous'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_secondary_beta_mean: {
    id: 'pair_secondary_beta_mean',
    name: 'Predicted Beta-Sheet Propensity (P_beta)',
    category: 'PredictedStructure',
    scientificMeaning: 'Mean conformational propensity to form extended beta-sheet structures.',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'Average P_beta across both chains.',
    softwareDependency: 'AffiniProt Secondary Structure Engine',
    units: 'propensity scale',
    missingValuePolicy: '1.0 default',
    expectedDataType: 'float64',
    usedInClasses: ['antigen_antibody', 'g_protein', 'miscellaneous'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_secondary_coil_mean: {
    id: 'pair_secondary_coil_mean',
    name: 'Predicted Coil/Loop Propensity (P_coil)',
    category: 'PredictedStructure',
    scientificMeaning: 'Mean propensity for unstructured loops and turns, which frequently mediate flexible binding interfaces.',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'Average P_turn across both chains.',
    softwareDependency: 'AffiniProt Secondary Structure Engine',
    units: 'propensity scale',
    missingValuePolicy: '1.0 default',
    expectedDataType: 'float64',
    usedInClasses: ['other_enzymes', 'receptor'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_molecular_weight_ratio: {
    id: 'pair_molecular_weight_ratio',
    name: 'Molecular Weight Ratio (MW_max / MW_min)',
    category: 'Physicochemical',
    scientificMeaning: 'Ratio of larger partner mass to smaller partner mass, capturing asymmetric binding partners (e.g. large protease with small inhibitor).',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'max(MW_A, MW_B) / min(MW_A, MW_B)',
    softwareDependency: 'AffiniProt Composition Engine',
    units: 'ratio',
    missingValuePolicy: '1.0 default',
    expectedDataType: 'float64',
    usedInClasses: ['enzyme_inhibitor', 'receptor'],
    isOriginalDeepPPAPredFeature: true
  },
  predicted_radius_gyration_ratio: {
    id: 'predicted_radius_gyration_ratio',
    name: 'Estimated Radius of Gyration Ratio',
    category: 'PredictedStructure',
    scientificMeaning: 'Estimated ratio of structural radii of gyration: Rg ≈ 2.82 * N^0.392 Å.',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'Rg(A) / Rg(B) via polymer compact scaling law.',
    softwareDependency: 'AffiniProt Structural Prediction Engine',
    units: 'ratio',
    missingValuePolicy: '1.0 default',
    expectedDataType: 'float64',
    usedInClasses: ['enzyme_inhibitor'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_flexibility_index_mean: {
    id: 'pair_flexibility_index_mean',
    name: 'Mean Vihinen Flexibility Index',
    category: 'Physicochemical',
    scientificMeaning: 'Average B-factor flexibility propensity from crystallographic temperature factor database (Vihinen 1994).',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'Average flexibility score per residue.',
    softwareDependency: 'AffiniProt Physicochemical Engine',
    units: 'flexibility units',
    missingValuePolicy: '1.0 default',
    expectedDataType: 'float64',
    usedInClasses: ['g_protein'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_tyrosine_mean: {
    id: 'pair_tyrosine_mean',
    name: 'Mean Tyrosine Composition',
    category: 'AAC',
    scientificMeaning: 'Frequency of Tyrosine residues, especially dominant in antibody CDR binding loops.',
    inputRequirements: 'Protein Pair',
    calculationMethod: '0.5 * (Tyr_freq_A + Tyr_freq_B)',
    softwareDependency: 'AffiniProt Composition Engine',
    units: 'percentage (0-100%)',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['antigen_antibody'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_tryptophan_mean: {
    id: 'pair_tryptophan_mean',
    name: 'Mean Tryptophan Composition',
    category: 'AAC',
    scientificMeaning: 'Frequency of Tryptophan, the premier thermodynamic hot spot residue across PPIs.',
    inputRequirements: 'Protein Pair',
    calculationMethod: '0.5 * (Trp_freq_A + Trp_freq_B)',
    softwareDependency: 'AffiniProt Composition Engine',
    units: 'percentage (0-100%)',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['antigen_antibody'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_arginine_mean: {
    id: 'pair_arginine_mean',
    name: 'Mean Arginine Composition',
    category: 'AAC',
    scientificMeaning: 'Frequency of Arginine, providing bidentate hydrogen bonds and salt bridges.',
    inputRequirements: 'Protein Pair',
    calculationMethod: '0.5 * (Arg_freq_A + Arg_freq_B)',
    softwareDependency: 'AffiniProt Composition Engine',
    units: 'percentage (0-100%)',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['antigen_antibody'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_lysine_mean: {
    id: 'pair_lysine_mean',
    name: 'Mean Lysine Composition',
    category: 'AAC',
    scientificMeaning: 'Frequency of Lysine, contributing positive charge and flexible aliphatic arm.',
    inputRequirements: 'Protein Pair',
    calculationMethod: '0.5 * (Lys_freq_A + Lys_freq_B)',
    softwareDependency: 'AffiniProt Composition Engine',
    units: 'percentage (0-100%)',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['g_protein'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_glutamate_mean: {
    id: 'pair_glutamate_mean',
    name: 'Mean Glutamate Composition',
    category: 'AAC',
    scientificMeaning: 'Frequency of Glutamate, conferring negative electrostatic surface potential.',
    inputRequirements: 'Protein Pair',
    calculationMethod: '0.5 * (Glu_freq_A + Glu_freq_B)',
    softwareDependency: 'AffiniProt Composition Engine',
    units: 'percentage (0-100%)',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['g_protein'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_cysteine_mean: {
    id: 'pair_cysteine_mean',
    name: 'Mean Cysteine Composition',
    category: 'AAC',
    scientificMeaning: 'Frequency of Cysteine residues, indicating disulfide bond stabilization in rigid inhibitors.',
    inputRequirements: 'Protein Pair',
    calculationMethod: '0.5 * (Cys_freq_A + Cys_freq_B)',
    softwareDependency: 'AffiniProt Composition Engine',
    units: 'percentage (0-100%)',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['enzyme_inhibitor'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_proline_mean: {
    id: 'pair_proline_mean',
    name: 'Mean Proline Composition',
    category: 'AAC',
    scientificMeaning: 'Frequency of Proline residues, inducing rigid backbone turns.',
    inputRequirements: 'Protein Pair',
    calculationMethod: '0.5 * (Pro_freq_A + Pro_freq_B)',
    softwareDependency: 'AffiniProt Composition Engine',
    units: 'percentage (0-100%)',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['other_enzymes'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_glycine_delta: {
    id: 'pair_glycine_delta',
    name: 'Glycine Composition Asymmetry (|Gly_A - Gly_B|)',
    category: 'AAC',
    scientificMeaning: 'Difference in Glycine prevalence, distinguishing flexible loops from structured scaffolds.',
    inputRequirements: 'Protein Pair',
    calculationMethod: 'abs(Gly_freq_A - Gly_freq_B)',
    softwareDependency: 'AffiniProt Composition Engine',
    units: 'percentage (0-100%)',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['enzyme_inhibitor'],
    isOriginalDeepPPAPredFeature: true
  },
  pair_serine_threonine_mean: {
    id: 'pair_serine_threonine_mean',
    name: 'Mean Serine + Threonine Composition',
    category: 'AAC',
    scientificMeaning: 'Hydroxyl-containing residues providing versatile hydrogen-bonding capacity at receptor interfaces.',
    inputRequirements: 'Protein Pair',
    calculationMethod: '0.5 * ((Ser_A + Thr_A) + (Ser_B + Thr_B))',
    softwareDependency: 'AffiniProt Composition Engine',
    units: 'percentage (0-100%)',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['receptor'],
    isOriginalDeepPPAPredFeature: true
  },
  protA_aromaticity: {
    id: 'protA_aromaticity',
    name: 'Protein A Aromaticity Fraction',
    category: 'Physicochemical',
    scientificMeaning: 'Aromatic residue fraction specifically for Protein A.',
    inputRequirements: 'Protein A',
    calculationMethod: '(Phe + Trp + Tyr) / Length_A',
    softwareDependency: 'AffiniProt Composition Engine',
    units: 'fraction (0 to 1)',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['antigen_antibody'],
    isOriginalDeepPPAPredFeature: true
  },
  protB_aromaticity: {
    id: 'protB_aromaticity',
    name: 'Protein B Aromaticity Fraction',
    category: 'Physicochemical',
    scientificMeaning: 'Aromatic residue fraction specifically for Protein B.',
    inputRequirements: 'Protein B',
    calculationMethod: '(Phe + Trp + Tyr) / Length_B',
    softwareDependency: 'AffiniProt Composition Engine',
    units: 'fraction (0 to 1)',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['antigen_antibody'],
    isOriginalDeepPPAPredFeature: true
  },
  protA_charge: {
    id: 'protA_charge',
    name: 'Protein A Net Charge at pH 7.4',
    category: 'Physicochemical',
    scientificMeaning: 'Calculated net formal charge for Protein A at physiological pH 7.4.',
    inputRequirements: 'Protein A',
    calculationMethod: 'Henderson-Hasselbalch ionization curve.',
    softwareDependency: 'AffiniProt Electrostatics Engine',
    units: 'elementary charges (e)',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['enzyme_inhibitor', 'g_protein', 'miscellaneous'],
    isOriginalDeepPPAPredFeature: true
  },
  protB_charge: {
    id: 'protB_charge',
    name: 'Protein B Net Charge at pH 7.4',
    category: 'Physicochemical',
    scientificMeaning: 'Calculated net formal charge for Protein B at physiological pH 7.4.',
    inputRequirements: 'Protein B',
    calculationMethod: 'Henderson-Hasselbalch ionization curve.',
    softwareDependency: 'AffiniProt Electrostatics Engine',
    units: 'elementary charges (e)',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['receptor'],
    isOriginalDeepPPAPredFeature: true
  },
  protA_hydropathy: {
    id: 'protA_hydropathy',
    name: 'Protein A Kyte-Doolittle Hydropathy',
    category: 'Physicochemical',
    scientificMeaning: 'Mean Kyte-Doolittle hydropathy for Protein A.',
    inputRequirements: 'Protein A',
    calculationMethod: 'Mean Kyte-Doolittle index across Protein A.',
    softwareDependency: 'AffiniProt Physicochemical Engine',
    units: 'KD scale units',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['receptor'],
    isOriginalDeepPPAPredFeature: true
  },
  protB_hydropathy: {
    id: 'protB_hydropathy',
    name: 'Protein B Kyte-Doolittle Hydropathy',
    category: 'Physicochemical',
    scientificMeaning: 'Mean Kyte-Doolittle hydropathy for Protein B.',
    inputRequirements: 'Protein B',
    calculationMethod: 'Mean Kyte-Doolittle index across Protein B.',
    softwareDependency: 'AffiniProt Physicochemical Engine',
    units: 'KD scale units',
    missingValuePolicy: '0.0',
    expectedDataType: 'float64',
    usedInClasses: ['enzyme_inhibitor', 'g_protein'],
    isOriginalDeepPPAPredFeature: true
  },
  protA_secondary_alpha: {
    id: 'protA_secondary_alpha',
    name: 'Protein A Alpha-Helix Propensity',
    category: 'PredictedStructure',
    scientificMeaning: 'Helical structural propensity of Protein A.',
    inputRequirements: 'Protein A',
    calculationMethod: 'Mean P_alpha across Protein A sequence.',
    softwareDependency: 'AffiniProt Secondary Structure Engine',
    units: 'propensity scale',
    missingValuePolicy: '1.0',
    expectedDataType: 'float64',
    usedInClasses: ['other_enzymes'],
    isOriginalDeepPPAPredFeature: true
  }
};
