import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastOneFieldValidator', async: false })
export class AtLeastOneFieldValidator implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments): boolean {
    const object = args.object as Record<string, any>;

    const otherFieldsPresent = Object.entries(object).some(
      ([key, value]) =>
        key !== args.property && value !== undefined && value !== null,
    );

    return otherFieldsPresent;
  }

  defaultMessage(args: ValidationArguments): string {
    const object = args.object as Record<string, any>;
    const otherKeys = Object.keys(object).filter((k) => k !== args.property);
    return `At least one of the following fields must be provided: ${otherKeys.join(', ')}`;
  }
}
