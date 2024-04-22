import SafeApiKit from '@safe-global/api-kit';

const apiKit = new SafeApiKit({
    chainId: 8453n,
});

// // or using a custom service
// const apiKit = new SafeApiKit({
//   chainId: 8453n, // set the correct chainId
//   txServiceUrl: 'https://url-to-your-custom-service'
// })
