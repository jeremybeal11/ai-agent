interface TrendingCoinsInterface {
    chain: string;
    limit?: number;
    timeframe?: string;
    description?: string;
}

class TrendingCoinsCommand implements TrendingCoinsInterface {
    public name: string;
    public chain: string;
    public limit: number;
    public timeframe: string;
    public description: string;

    constructor(chain: string, limit: number = 5, timeframe: string = '24h') {
        this.name = 'TRENDING_COINS';
        this.chain = chain;
        this.limit = limit;
        this.timeframe = timeframe;
        this.description = `Get the trending coins on ${
            chain ?? 'the given blockchain (e.g. Ethereum, Binance, Base, etc.)'
        } in the last ${timeframe}`;
    }

    public serialize(): string {
        return JSON.stringify({
            chain: this.chain,
            limit: this.limit,
            timeframe: this.timeframe,
            description: this.description,
        });
    }
}

export { TrendingCoinsCommand, TrendingCoinsInterface };
