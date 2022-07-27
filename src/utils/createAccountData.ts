//import { CreateAccountDto } from 'src/accounts/dtos/create-account.dto';

class CreateAccountData {
  createAgencyAccount(quantity: number): string {
    const numbers = [];
    for (let i = 0; i < quantity; i += 1) {
      numbers.push(Math.floor(Math.random() * 10));
    }
    return numbers.join('').toString();
  }

  createDigit(verifyDigitlocal: string): string {
    let sum = 0;
    for (let i = 0; i < verifyDigitlocal.length; i += 1) {
      sum += parseInt(verifyDigitlocal[i], 10);
    }
    return (sum % 10).toString();
  }

  generateData() {
    const agency = this.createAgencyAccount(8);
    const account_number = this.createAgencyAccount(5);

    const data = {
      agency: agency,
      account_number: account_number,
      digit_agency_v: this.createDigit(agency),
      digit_account_v: this.createDigit(account_number),
      balance: 0,
    };
    return data;
  }
}

export { CreateAccountData };
