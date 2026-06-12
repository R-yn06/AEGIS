interface Project {
    id: string;
    name: string;
    riskLevel: 'good' | 'review' | 'high';
}

interface Material {
    id: string;
    name: string;
    price: number;
}

interface CitizenUploadForm {
    projectId: string;
    notes: string;
    image: File | null;
}