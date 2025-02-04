import { z } from 'zod';

export const histopathologicalSchema = z.object({
  age: z.string(),
  tobacco: z.enum(['Yes', 'No', 'Former']),
  smoking: z.enum(['Yes', 'No', 'Former']),
  panMasala: z.enum(['Yes', 'No', 'Former']),
  symptomDuration: z.string(),
  painLevel: z.enum(['None', 'Mild', 'Moderate', 'Severe']).optional(),
  difficultySwallowing: z.enum(['Yes', 'No']).optional(),
  weightLoss: z.enum(['Yes', 'No']).optional(),
  familyHistory: z.enum(['Yes', 'No', 'Unknown']).optional(),
  immuneCompromised: z.enum(['Yes', 'No', 'Unknown']).optional(),
  persistentSoreThroat: z.enum(['Yes', 'No']).optional(),
  voiceChanges: z.enum(['Yes', 'No']).optional(),
  lumpsInNeck: z.enum(['Yes', 'No']).optional(),
  frequentMouthSores: z.enum(['Yes', 'No']).optional(),
  poorDentalHygiene: z.enum(['Yes', 'No']).optional(),
});

export type HistopathologicalData = z.infer<typeof histopathologicalSchema>;

export function processImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function processVideo(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const videoBlob = new Blob([reader.result as ArrayBuffer], { type: file.type });
        const video = document.createElement('video');
        video.src = URL.createObjectURL(videoBlob);
        
        await new Promise((res) => {
          video.onloadedmetadata = () => res(null);
        });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const frames: string[] = [];
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Extract frames every second
        for (let i = 0; i < video.duration; i++) {
          video.currentTime = i;
          await new Promise((res) => {
            video.onseeked = () => {
              context?.drawImage(video, 0, 0);
              const base64Frame = canvas.toDataURL('image/jpeg')
                .replace('data:image/jpeg;base64,', '');
              frames.push(base64Frame);
              res(null);
            };
          });
        }
        
        URL.revokeObjectURL(video.src);
        resolve(frames);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}