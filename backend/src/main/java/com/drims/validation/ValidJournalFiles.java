package com.drims.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = JournalFileValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidJournalFiles {
    String message() default "Required file uploads are missing based on journal status";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
