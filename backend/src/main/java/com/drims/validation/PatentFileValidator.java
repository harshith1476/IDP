package com.drims.validation;

import com.drims.dto.PatentDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PatentFileValidator implements ConstraintValidator<ValidPatentFiles, PatentDTO> {

    @Override
    public void initialize(ValidPatentFiles constraintAnnotation) {
    }

    @Override
    public boolean isValid(PatentDTO dto, ConstraintValidatorContext context) {
        if (dto == null || dto.getStatus() == null) {
            return true; // Let @NotBlank handle null status
        }

        context.disableDefaultConstraintViolation();
        boolean isValid = true;

        String status = dto.getStatus().toLowerCase();

        // Filed status requires filing proof
        if (status.contains("filed")) {
            if (isBlankOrNull(dto.getFilingProofPath())) {
                context.buildConstraintViolationWithTemplate("Filing proof is required for Filed status")
                        .addPropertyNode("filingProofPath")
                        .addConstraintViolation();
                isValid = false;
            }
        }

        // Published or Granted status requires publication certificate
        if (status.contains("published") || status.contains("granted")) {
            if (isBlankOrNull(dto.getPublicationCertificatePath())) {
                context.buildConstraintViolationWithTemplate("Publication certificate is required for " + dto.getStatus() + " status")
                        .addPropertyNode("publicationCertificatePath")
                        .addConstraintViolation();
                isValid = false;
            }
        }

        // Granted status requires grant certificate
        if (status.contains("granted")) {
            if (isBlankOrNull(dto.getGrantCertificatePath())) {
                context.buildConstraintViolationWithTemplate("Grant certificate is required for Granted status")
                        .addPropertyNode("grantCertificatePath")
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
