export interface MedicalRecordEntry {
    id: string;
    patientId: string;
    professionalId: string;
    date: string;
    type: 'consultation' | 'exam' | 'procedure';
    title: string;
    description: string;
    diagnosis?: string;
    symptoms?: string;
    treatment?: string;
    notes?: string;
    attachments?: Attachment[];
    prescriptions?: Prescription[];
}

export interface Attachment {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadDate: string;
}

export interface Prescription {
    id: string;
    medicalRecordId: string;
    patientId: string;
    professionalId: string;
    date: string;
    expirationDate?: string;
    medications: Medication[];
    instructions: string;
    status: 'active' | 'expired' | 'cancelled';
}

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
}

export interface Patient {
    id: string;
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: 'male' | 'female' | 'other';
    bloodType?: string;
    allergies?: string[];
    chronicConditions?: string[];
    address?: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
}

export interface MedicalHistory {
    conditions: HealthCondition[];
    surgeries: Surgery[];
    medications: CurrentMedication[];
    familyHistory: FamilyHistory[];
    allergies: Allergy[];
}

interface HealthCondition {
    name: string;
    diagnosisDate: string;
    status: 'active' | 'in_treatment' | 'resolved';
    notes?: string;
}

interface Surgery {
    procedure: string;
    date: string;
    hospital?: string;
    surgeon?: string;
    notes?: string;
}

interface CurrentMedication {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    purpose?: string;
}

interface FamilyHistory {
    condition: string;
    relationship: string;
    notes?: string;
}

interface Allergy {
    substance: string;
    severity: 'mild' | 'moderate' | 'severe';
    reaction: string;
} 