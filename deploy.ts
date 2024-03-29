import { Bsv20V2Token } from './src/contracts/bsv20V2Token'
import {
    bsv,
    TestWallet,
    DefaultProvider,
    sha256,
    toByteString,
} from 'scrypt-ts'

import * as dotenv from 'dotenv'

// Load the .env file
dotenv.config()

if (!process.env.PRIVATE_KEY) {
    throw new Error(
        'No "PRIVATE_KEY" found in .env, Please run "npm run genprivkey" to generate a private key'
    )
}

// Read the private key from the .env file.
// The default private key inside the .env file is meant to be used for the Bitcoin testnet.
// See https://scrypt.io/docs/bitcoin-basics/bsv/#private-keys
const privateKey = bsv.PrivateKey.fromWIF(process.env.PRIVATE_KEY || '')

// Prepare signer.
// See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
const signer = new TestWallet(
    privateKey,
    new DefaultProvider({
        network: bsv.Networks.testnet,
    })
)

async function main() {
    await Bsv20V2Token.loadArtifact()

    // TODO: Adjust the amount of satoshis locked in the smart contract:
    const amount = 1

    const instance = new Bsv20V2Token(
        // TODO: Adjust constructor parameter values:

        sha256(toByteString('tokenId', true))
    )

    // Connect to a signer.
    await instance.connect(signer)

    // Contract deployment.
    const deployTx = await instance.deploy(amount)
    console.log(`Bsv20V2Token contract deployed: ${deployTx.id}`)
}

main()
