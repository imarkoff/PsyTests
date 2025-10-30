export interface PasswordConfig {
  minLength: number;
  maxLength: number;
  minLowercase: number;
  minUppercase: number;
  minNumbers: number;
  minSymbols: number;
}

export default (): { password: PasswordConfig } => ({
  password: {
    minLength: 6,
    maxLength: 64,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  },
});
