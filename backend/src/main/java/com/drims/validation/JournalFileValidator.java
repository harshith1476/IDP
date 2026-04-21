package com.drims.validation;

import com.drims.dto.JournalDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class JournalFileValidator implements ConstraintValidator<ValidJournalFiles, JournalDTO> {

    @Override
    public void initialize(ValidJournalFiles constraintAnnotation) {
    }

    @Override
    public boolean isValid(JournalDTO dto, ConstraintValidatorContext context) {
        if (dto == null || dto.getStatus() == null) {
            return true; // Let other annotations handle nulls
        }

        context.disableDefaultConstraintViolation();
        boolean isValid = true;

        String status = dto.getStatus();

        // Acceptance Mail is required for Accepted or Submitted
        if ("Accepted".equalsIgnoreCase(status) || "Submitted".equalsIgnoreCase(status)) {
            if (isBlankOrNull(dto.getAcceptanceMailPath())) {
                context.buildConstraintViolationWithTemplate("Acceptance mail is required for " + status + " status")
                        .addPropertyNode("acceptanceMailPath")
                        .addConstraintViolation();
                isValid = false;
            }
        }

        // Published Paper is required for Published
        if ("Published".equalsIgnoreCase(status)) {
            if (isBlankOrNull(dto.getPublishedPaperPath())) {
                context.buildConstraintViolationWithTemplate("Published paper is required for Published status")
                        .addPropertyNode("publishedPaperPath")
                        .addConstraintViolation();
                isValid = false;
            }
        }

        return isValid;
    }

    private boolean isBlankOrNull(String value) {
        return value == null || value.trim().isEmpty();
    }
}
