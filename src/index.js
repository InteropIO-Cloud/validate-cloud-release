import { Octokit } from "octokit";

const validateEdited = (parsedChanges) => {
    if (parsedChanges?.make_latest?.to) {
        console.log("This is recognized as release changed to latest, proceeding with the deployment.");
        return;
    }

    console.warn("This is not recognized as release changed to latest, aborting the deployment.");

    process.exit(1);
};

const validateReleased = async ({ token, repoName, tagName, owner }) => {
    const octokit = new Octokit({
        auth: token,
    });

    console.log(`Getting the latest release for ${owner}/${repoName}...`);

    const latestResponse = await octokit.rest.repos.getLatestRelease({
        owner: owner,
        repo: repoName,
    });

    const latestReleaseTagName = latestResponse.data.tag_name;

    if (latestReleaseTagName !== tagName) {
        console.warn(`This release was not marked as latest, aborting the deployment.`);

        process.exit(1);
    }

    console.log(`This release was marked as latest, proceeding with the deployment.`);
};

const run = async () => {

    const tagName = process.env["INPUT_TAG-NAME"];
    const actionName = process.env["INPUT_ACTION-NAME"];
    const changes = process.env["INPUT_CHANGES"];
    const token = process.env["INPUT_TOKEN"];
    const repoName = process.env["INPUT_REPO-NAME"];
    const owner = process.env["INPUT_REPO-OWNER"];

    const parsedChanges = changes ? JSON.parse(changes) : null;

    if (actionName === "edited") {
        return validateEdited(parsedChanges);
    }

    if (actionName === "released") {
        return await validateReleased({ token, repoName, tagName, owner });
    }
};

run().then(() => console.log("Validation completed successfully."));
