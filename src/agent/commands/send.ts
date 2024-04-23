interface SendCommandInterface {
    name: string;
    walletAddress: string;
    amount: number;
    currency: string;
    description: string;
    serialize(): string;
}

class SendCommand implements SendCommandInterface {
    public name: string;
    public walletAddress: string;
    public amount: number;
    public currency: string;
    public description: string;

    constructor(
        walletAddress: string = '',
        amount: number = 0,
        currency: string = '',
        description: string = 'Send funds to a target wallet address with a specific amount and currency'
    ) {
        this.name = 'SEND';
        this.walletAddress = walletAddress;
        this.amount = amount;
        this.currency = currency;
        this.description = description;
    }

    public serialize(): string {
        return JSON.stringify({
            walletAddress: this.walletAddress,
            amount: this.amount,
            currency: this.currency,
            description: this.description,
        });
    }
}

export { SendCommandInterface, SendCommand };
