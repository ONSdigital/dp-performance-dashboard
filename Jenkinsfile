#!groovy

node {
    def branch = env.JOB_NAME.replaceFirst('.+/', '')

    stage('Checkout') {
        checkout scm
        sh 'git clean -dfx'
        sh 'git rev-parse --short HEAD > git-commit'
        sh 'set +e && (git describe --exact-match HEAD || true) > git-tag'
    }

    stage('Build') {
        sh 'npm install --no-bin-links'
    }

    stage('Bundle') {
        def revision = revisionFrom(readFile('git-tag').trim(), readFile('git-commit').trim())
        sh "tar -cvzf performance-dashboard-${revision}.tar.gz dist"
        sh "aws s3 cp performance-dashboard-${revision}.tar.gz s3://${env.S3_REVISIONS_BUCKET}/"
    }

    if (branch != 'develop' && branch != 'master') return

    stage('Deploy') {
        sh "aws s3 cp --cache-control max-age=300 --recursive dist s3://${bucketFor(branch)}/"
    }
}

def bucketFor(branch) {
    branch == 'master' ? env.S3_PRODUCTION_PERFORMANCE_BUCKET : env.S3_DEVELOP_PERFORMANCE_BUCKET
}

@NonCPS
def revisionFrom(tag, commit) {
    def matcher = (tag =~ /^release\/(\d+\.\d+\.\d+(?:-rc\d+)?)$/)
    matcher.matches() ? matcher[0][1] : commit
}
