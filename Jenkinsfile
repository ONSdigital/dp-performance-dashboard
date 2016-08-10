#!groovy

node {
    stage 'Checkout'
    checkout scm
    sh 'git clean -dfx'
    sh 'git rev-parse --short HEAD > git-commit'
    sh 'set +e && (git describe --exact-match HEAD || true) > git-tag'

    stage 'Build'
    sh 'npm install --no-bin-links'

    stage 'Bundle'
    def revision = revision()
    sh "tar -cvzf performance-dashboard-${revision}.tar.gz dist"
    sh "aws s3 cp performance-dashboard-${revision}.tar.gz s3://${env.S3_REVISIONS_BUCKET}/"

    if (env.JOB_NAME.replaceFirst('.+/', '') != 'develop') return

    stage 'Deploy'
    sh "aws s3 cp --recursive dist s3://${env.S3_DEVELOP_PERFORMANCE_BUCKET}/"
}

def revision() {
    def matcher = (readFile('git-tag').trim() =~ /^release\/(\d+\.\d+\.\d+(?:-rc\d+)?)$/)
    matcher.matches() ? matcher[0][1] : readFile('git-commit').trim()
}
