const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

beforeEach(() => {
  fs.rmdirSync('tests/__data__/temp', { recursive: true })
  fs.rmdirSync('tests/__data__/output', { recursive: true })
  fs.mkdirSync('tests/__data__/output')
  fs.mkdirSync('tests/__data__/temp/database', { recursive: true })
  fs.copyFileSync(
    'tests/__data__/input/database/channels.db',
    'tests/__data__/temp/database/channels.db'
  )

  execSync(
    'DB_DIR=tests/__data__/temp/database LOGS_DIR=tests/__data__/output/logs node scripts/commands/load-cluster.js --cluster-id=1 --timeout=10000',
    { encoding: 'utf8' }
  )
})

it('can load cluster', () => {
  const output = content('tests/__data__/output/logs/load-cluster/cluster_1.log')

  expect(output[0]).toMatchObject({
    _id: '0Wefq0oMR3feCcuY',
    site: 'chaines-tv.orange.fr',
    logo: 'https://example.com/logo.png',
    country: 'US',
    gid: 'fr'
  })

  expect(output[1]).toMatchObject({
    _id: '1XzrxNkSF2AQNBrT',
    site: 'magticom.ge',
    logo: 'https://www.magticom.ge/images/channels/MjAxOC8wOS8xMC9lZmJhNWU5Yy0yMmNiLTRkMTAtOWY5Ny01ODM0MzY0ZTg0MmEuanBn.jpg',
    country: 'US',
    gid: 'ge'
  })
})

function content(filepath) {
  const data = fs.readFileSync(path.resolve(filepath), {
    encoding: 'utf8'
  })

  return data
    .split('\n')
    .filter(l => l)
    .map(l => {
      return JSON.parse(l)
    })
}