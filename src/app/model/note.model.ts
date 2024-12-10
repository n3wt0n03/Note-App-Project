export interface Note {
    id: number;         // Unique identifier for the note
    title: string;      // Title of the note
    category: string;   // Category of the note (e.g., Study, Work, Personal)
    description: string; // Detailed description of the note
    date: string;       // Date of the note in ISO format (e.g., YYYY-MM-DD)
  }
  