module.exports = {
  extends: 'lighthouse:default',
  settings: {
    emulatedFormFactor: 'mobile',
    throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
    audits: [
      { path: 'metrics/first-contentful-paint', options: { scorePODR: 80000, scoreMedian: 16000 } },
      { path: 'metrics/first-meaningful-paint', options: { scorePODR: 80000, scoreMedian: 160000 } },
      { path: 'metrics/speed-index', options: { scorePODR: 110000, scoreMedian: 230000 } },
      { path: 'metrics/interactive', options: { scorePODR: 200000, scoreMedian: 450000 } },
      { path: 'metrics/first-cpu-idle', options: { scorePODR: 200000, scoreMedian: 4500000 } }
    ]
  }
}
