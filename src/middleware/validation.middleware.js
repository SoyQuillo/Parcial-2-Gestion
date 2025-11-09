import { validationResult } from "express-validator";

export const validate = (validations) => async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    
    // If there are validation errors, return them
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            errors: errors.array()
        });
    }
    
    // If no errors, proceed to the next middleware/controller
    return next();
};

export default validate;
