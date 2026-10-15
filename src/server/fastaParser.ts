/**
 * AffiniProt DL - FASTA Parsing & Protein Sequence Validation Module
 * Scientifically rigorous parser conforming to standard IUPAC 20 amino acid alphabet
 * and documented handling of non-standard / ambiguous residue codes.
 */

export interface ParsedSequence {
  id: string;
  header: string;
  rawSequence: string;
  cleanedSequence: string;
  length: number;
  isValid: boolean;
  warnings: string[];
  errors: string[];
  composition: Record<string, number>;
  molecularWeightEstimated: number; // in Daltons
}

export interface FastaValidationResult {
  isValid: boolean;
  parsedSequence?: ParsedSequence;
  errors: string[];
  warnings: string[];
}

// Standard 20 canonical amino acids
export const CANONICAL_AMINO_ACIDS = new Set([
  'A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L',
  'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y'
]);

// Average monoisotopic/average residue masses (minus H2O 18.015 Da)
export const RESIDUE_MOLECULAR_WEIGHTS: Record<string, number> = {
  A: 71.08,  R: 156.20, N: 114.11, D: 115.09, C: 103.14,
  E: 129.12, Q: 128.13, G: 57.05,  H: 137.15, I: 113.17,
  L: 113.17, K: 128.18, M: 131.21, F: 147.18, P: 97.12,
  S: 87.08,  T: 101.11, W: 186.21, Y: 163.18, V: 99.13
};

// Documented mapping/handling for ambiguous or extended codes
export const AMBIGUOUS_RESIDUE_MAP: Record<string, string> = {
  B: 'D', // Asx (Aspartate or Asparagine) -> mapped to D (conservative physicochemical choice)
  Z: 'E', // Glx (Glutamate or Glutamine) -> mapped to E
  J: 'L', // Xle (Leucine or Isoleucine) -> mapped to L
  U: 'C', // Sec (Selenocysteine) -> mapped to C
  O: 'K', // Pyl (Pyrrolysine) -> mapped to K
};

/**
 * Validates whether an input string looks like a nucleotide sequence rather than protein.
 * If >85% of characters are A, C, G, T, U and length > 20, flags strong likelihood of DNA/RNA.
 */
export function detectNucleotideSequence(seq: string): boolean {
  if (seq.length < 20) return false;
  const nucCount = (seq.match(/[ACGTU]/gi) || []).length;
  return nucCount / seq.length > 0.88;
}

/**
 * Parses raw FASTA text or plain sequence string into a validated ParsedSequence.
 */
export function parseFasta(rawInput: string, defaultId = 'Protein'): FastaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rawInput || typeof rawInput !== 'string' || rawInput.trim().length === 0) {
    return {
      isValid: false,
      errors: ['Input sequence is empty. Please provide a valid FASTA sequence.'],
      warnings: []
    };
  }

  const lines = rawInput.split(/\r?\n/);
  let header = defaultId;
  let id = defaultId;
  const sequenceLines: string[] = [];
  let foundHeader = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('>')) {
      if (!foundHeader) {
        header = trimmed.substring(1).trim();
        const firstToken = header.split(/\s+/)[0];
        id = firstToken || defaultId;
        foundHeader = true;
      } else {
        // Multi-record FASTA detected: only process first record for single-chain input
        warnings.push(`Multiple FASTA records detected in single input field. Only the first record (">${id}") was analyzed.`);
        break;
      }
    } else {
      sequenceLines.push(trimmed);
    }
  }

  const concatenated = sequenceLines.join('').toUpperCase().replace(/\s+/g, '');

  if (concatenated.length === 0) {
    return {
      isValid: false,
      errors: ['No amino acid sequence found following the FASTA header or in plain text.'],
      warnings
    };
  }

  // Check for nucleotide mistake
  if (detectNucleotideSequence(concatenated)) {
    errors.push('The provided sequence appears to be a DNA or RNA nucleotide sequence (predominantly A, C, G, T, U). AffiniProt requires an amino acid polypeptide sequence.');
  }

  // Validate characters against 20 standard amino acids and recognized ambiguous codes
  const invalidChars: string[] = [];
  const ambiguousChars: string[] = [];
  let cleanedSeq = '';

  for (let i = 0; i < concatenated.length; i++) {
    const char = concatenated[i];
    if (CANONICAL_AMINO_ACIDS.has(char)) {
      cleanedSeq += char;
    } else if (AMBIGUOUS_RESIDUE_MAP[char]) {
      ambiguousChars.push(char);
      cleanedSeq += AMBIGUOUS_RESIDUE_MAP[char];
    } else if (char === 'X') {
      ambiguousChars.push('X');
      // For undetermined residue X, default to Alanine (neutral aliphatic scaffold) with warning
      cleanedSeq += 'A';
    } else if (char === '*' || char === '-') {
      // Termination codon or alignment gap
      warnings.push(`Stripped stop codon or gap symbol ('${char}') at position ${i + 1}.`);
    } else {
      if (!invalidChars.includes(char)) {
        invalidChars.push(char);
      }
    }
  }

  if (invalidChars.length > 0) {
    errors.push(`Sequence contains unsupported non-amino acid characters: ${invalidChars.map(c => `'${c}'`).join(', ')}. Standard IUPAC single-letter amino acid code required.`);
  }

  if (ambiguousChars.length > 0) {
    const uniqueAmb = Array.from(new Set(ambiguousChars));
    warnings.push(`Sequence contained ambiguous IUPAC amino acid codes (${uniqueAmb.join(', ')}). Ambiguous residues were mapped according to standard physicochemical defaults (B->D, Z->E, J->L, U->C, O->K, X->A).`);
  }

  if (cleanedSeq.length < 5) {
    errors.push(`Sequence length (${cleanedSeq.length} aa) is below the minimum valid length of 5 residues for biological protein complexes.`);
  }

  if (cleanedSeq.length > 5000) {
    warnings.push(`Sequence length (${cleanedSeq.length} aa) is unusually long; descriptors are calculated globally across all residues.`);
  }

  // Compute composition and estimated molecular weight
  const composition: Record<string, number> = {};
  for (const aa of Array.from(CANONICAL_AMINO_ACIDS)) {
    composition[aa] = 0;
  }
  let totalWeight = 18.015; // water molecule for free termini
  for (const aa of cleanedSeq) {
    composition[aa] = (composition[aa] || 0) + 1;
    totalWeight += RESIDUE_MOLECULAR_WEIGHTS[aa] || 110.0;
  }

  const isValid = errors.length === 0 && cleanedSeq.length >= 5;

  const parsedSequence: ParsedSequence = {
    id,
    header,
    rawSequence: concatenated,
    cleanedSequence: cleanedSeq,
    length: cleanedSeq.length,
    isValid,
    warnings,
    errors,
    composition,
    molecularWeightEstimated: Math.round(totalWeight * 10) / 10
  };

  return {
    isValid,
    parsedSequence: isValid ? parsedSequence : undefined,
    errors,
    warnings
  };
}
