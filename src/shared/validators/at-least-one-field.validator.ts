import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
  getMetadataStorage,
} from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastOneFieldValidator', async: false })
export class AtLeastOneFieldValidator implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments): boolean {
    const object = args.object as Record<string, any>;

    // Get field names from class-validator metadata
    const metadataStorage = getMetadataStorage();
    const fieldNames = metadataStorage
      .getTargetValidationMetadatas(args.object.constructor, '', false, false)
      .map((meta) => meta.propertyName);

    const uniqueFields = [...new Set(fieldNames)];

    const otherFieldsPresent = uniqueFields.some(
      (fieldName: string) =>
        fieldName !== args.property &&
        object[fieldName] !== undefined &&
        object[fieldName] !== null,
    );

    return otherFieldsPresent;
  }

  defaultMessage(args: ValidationArguments): string {
    const metadataStorage = getMetadataStorage();
    const fieldNames = metadataStorage
      .getTargetValidationMetadatas(args.object.constructor, '', false, false)
      .map((meta) => meta.propertyName);

    const uniqueFields = [...new Set(fieldNames)];
    const otherFields = uniqueFields.filter(
      (field: string) => field !== args.property,
    );
    return `At least one of the following fields must be provided: ${otherFields.join(', ')}`;
  }
}

export function AtLeastOneField(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: AtLeastOneFieldValidator,
    });
  };
}
