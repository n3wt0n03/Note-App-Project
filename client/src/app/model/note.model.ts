import { Category } from './category.model'; // Ensure you import the correct model

export interface Note {
  id?: number;         // Unique identifier for the note
  title: string;       // Title of the note
  category: Category | { id: number } | null; // Allow both full Category or just id
  description: string; // Detailed description of the note
  date: string;        // Date of the note in ISO format (e.g., YYYY-MM-DD)
  color: string;      // Background color of the note (e.g., hex color code
}
