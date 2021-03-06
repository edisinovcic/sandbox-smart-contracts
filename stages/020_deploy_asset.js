const {guard} = require('../lib');

module.exports = async ({namedAccounts, initialRun, getDeployedContract, deployIfDifferent}) => {
    function log(...args) {
        if (initialRun) {
            console.log(...args);
        }
    }

    const {
        deployer,
    } = namedAccounts;

    const sandContract = getDeployedContract('Sand');
    if (!sandContract) {
        throw new Error('no SAND contract deployed');
    }

    const deployResult = await deployIfDifferent(['data'],
        'Asset',
        {from: deployer, gas: 8000000}, // , gasPrice: '10000000000'},
        'Asset',
        sandContract.address,
        deployer, // is set to assetAdmin in a later stage
        deployer, // is set to assetBouncerAdmin in a later stage
    );
    if (deployResult.newlyDeployed) {
        log(' - Asset deployed at : ' + deployResult.contract.address + ' for gas : ' + deployResult.receipt.gasUsed);
    } else {
        log('reusing Asset at ' + deployResult.contract.address);
    }
};
module.exports.skip = guard(['1', '4', '314159'], 'Asset');
