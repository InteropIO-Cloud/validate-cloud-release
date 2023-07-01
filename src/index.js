import { Octokit } from "octokit";
import * as core from "@actions/core"

const validateEdited = (parsedChanges) => {
    if (parsedChanges?.make_latest?.to) {
        core.notice("This is recognized as release changed to latest, proceeding with the deployment.");
        return;
    }

    core.warning("This is not recognized as release changed to latest, aborting the deployment.");

    process.exit(core.ExitCode.Failure);
};

const validateReleased = async ({ token, repoName, tagName, owner }) => {
    const octokit = new Octokit({
        auth: token,
    });

    core.notice(`Getting the latest release for ${owner}/${repoName}...`);

    const latestResponse = await octokit.rest.repos.getLatestRelease({
        owner: owner,
        repo: repoName,
    });

    const latestReleaseTagName = latestResponse.data.tag_name;

    if (latestReleaseTagName !== tagName) {
        core.warning(`This release was not marked as latest, aborting the deployment.`);

        process.exit(core.ExitCode.Failure);
    }

    core.notice(`This release was marked as latest, proceeding with the deployment.`);
};

const run = async () => {

    const tagName = core.getInput("tag-name", { required: true });
    const actionName = core.getInput("action-name", { required: true });
    const changes = core.getInput("changes", { required: true });
    const token = core.getInput("token", { required: true });
    const repoName = core.getInput("repo-name", { required: true });
    const owner = core.getInput("repo-owner", { required: true });

    const parsedChanges = changes ? JSON.parse(changes) : null;

    if (actionName === "edited") {
        return validateEdited(parsedChanges);
    }

    if (actionName === "released") {
        return await validateReleased({ token, repoName, tagName, owner });
    }

    core.warning(`This action is not recognized: ${actionName}, aborting the deployment.`);
    
    process.exit(core.ExitCode.Failure);
};

run().then(() => core.notice("Validation completed successfully."));
