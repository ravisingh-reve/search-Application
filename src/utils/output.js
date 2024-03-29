const core = require('@actions/core')
const { getLinks, getAssertionResults, getManifest } = require('./lhci-helpers')

/**
 * Set output: {
 *   resultsPath: string
 *   links: Object<url,url> (links.json)
 *   assertionResults: LHCIAssertion[] (assertion-results.json)
 *   manifest: LHCIManifest[] (manifest.json)
 * }
 *
 * @param {string} resultsPath
 */

exports.setOutput = async function setOutput(resultsPath) {
  const links = await getLinks(resultsPath)
  const assertionResults = await getAssertionResults(resultsPath)
  const manifestResults = await getManifest(resultsPath)

  core.setOutput('resultsPath', resultsPath)
  core.setOutput('links', links ? JSON.stringify(links) : '')
  core.setOutput('assertionResults', assertionResults ? JSON.stringify(assertionResults) : '')
  core.setOutput('manifest', manifestResults ? JSON.stringify(manifestResults) : '')
  core.setOutput('summaryData', manifestResults ? JSON.stringify(manifestResults)[0].summary : '')
  core.setOutput('jsonPath', manifestResults ? JSON.stringify(manifestResults)[0].jsonPath : '')
  core.setOutput('htmlPath', manifestResults ? JSON.stringify(manifestResults)[0].htmlPath : '')
  core.setOutput('actualUrl', manifestResults ? JSON.stringify(manifestResults)[0].url : '') 
}
