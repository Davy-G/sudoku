import {ValidationResult} from "@/types";

interface ValidationGridProps {
  validationResult: ValidationResult;
}

export default function ValidationGrid({ validationResult }: ValidationGridProps) {
  return (
      <div className="text-3xl border-red-600 text-red-500">
        {validationResult.isValid ? '' : validationResult.errorMessage}
      </div>
  );
}