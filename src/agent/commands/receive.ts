interface ReceiveCommandInterface {
    name: string;
    walletAddress: string;
    amount: number;
    currency: string;
    description: string;
    serialize(): string;
}

class ReceiveCommand implements ReceiveCommandInterface {
    public name: string;
    public walletAddress: string;
    public amount: number;
    public currency: string;
    public description: string;

    constructor(
        walletAddress: string = '',
        amount: number = 0,
        currency: string = '',
        description: string = 'Request funds from a sender with a specific amount and currency'
    ) {
        this.name = 'RECEIVE';
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

export { ReceiveCommand, ReceiveCommandInterface };
