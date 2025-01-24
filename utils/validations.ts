export const getEmailValidation = (email: string): boolean => {
  if (email.length === 0) return true

  return new RegExp(
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i,
  ).test(email.trim())
}

export const getPasswordValidation = (password: string): boolean => {
  if (password.length === 0) return true

  return new RegExp(/^(?!.* ).{6,}$/i).test(password)
}

export const getIsPasswordSame = (
  password: string,
  repeatPassword: string,
): boolean => {
  return password === repeatPassword
}

export const getPhoneValidation = (phone: string): boolean => {
  return phone.trim().length > 10 && new RegExp(/^[0-9]+$/i).test(phone.trim());
};

export const getFieldValidation = (firstName: string): boolean => {
  return firstName.trim().length > 0 && new RegExp(/^[a-zA-Z]+$/i).test(firstName.trim());
};

