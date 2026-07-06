import React, { useState } from 'react';
import { ImagePlus, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageDropzoneProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function ImageDropzone({ files, onChange }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles = Array.from(incoming).filter((f) => f.type.startsWith('image/'));
    if (newFiles.length) onChange([...files, ...newFiles]);
  };

  const removeAt = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const moveLeft = (index: number) => {
    if (index === 0) return;
    const next = [...files];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveRight = (index: number) => {
    if (index === files.length - 1) return;
    const next = [...files];
    [next[index + 1], next[index]] = [next[index], next[index + 1]];
    onChange(next);
  };

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-1 border-2 border-dashed rounded-lg py-6 px-4 cursor-pointer transition-colors ${
          isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400'
        }`}
      >
        <ImagePlus className="h-6 w-6 text-gray-400" />
        <span className="text-sm text-gray-500">Glissez des images ici, ou cliquez pour choisir</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </label>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {files.map((file, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Retirer l'image"
              >
                <X size={12} />
              </button>
              <div className="absolute bottom-1 inset-x-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => moveLeft(i)}
                  disabled={i === 0}
                  className="bg-black/60 text-white rounded-full p-0.5 disabled:opacity-30"
                  aria-label="Déplacer à gauche"
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => moveRight(i)}
                  disabled={i === files.length - 1}
                  className="bg-black/60 text-white rounded-full p-0.5 disabled:opacity-30"
                  aria-label="Déplacer à droite"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
