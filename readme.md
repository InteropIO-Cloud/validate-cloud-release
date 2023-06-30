# Validate Cloud Release Github Action

This action is designed to be used in the io.Cloud CD pipeline to validate if a release is suitable for deployment.

Usage:
```yaml
- name: Validate Release
  uses: interopio-cloud/validate-cloud-release@v1
    with:
      tag-name: ${{ github.event.release.tag_name }}
      action-name: ${{ github.event.action }}
      changes: ${{ toJson(github.event.changes) }}
      token: ${{ github.token }}
      repo-name: ${{ github.event.repository.name }}
      repo-owner: ${{ github.repository_owner }}
```

The action either exits with 0, if the release event is valid for deployment, or 1 if not.

A valid deployment is a newly created release, which is not a pre-release, not a draft and is marked as latest.

A valid deployment is also an existing release changed to latest.