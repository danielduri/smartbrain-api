import fetch from "node-fetch";
import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc"

const stub = ClarifaiStub.grpc();

const handleAPICall = (req, res) => {
    const USER_ID = 'danieldu';
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '2f76949c47694609803c5841b50e22b1';
    const APP_ID = 'my-first-application';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = req.body.imageURL;

    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);

    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            inputs: [
                { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                return res.status(400).json('Unable to fetch API');
            }

            if (response.status.code !== 10000) {
                return res.status(400).json('Invalid API result');
            }

            // Since we have one input, one output will exist here.
            const output = response.outputs[0].data;
            return res.json(output);
        }
    )

    /*
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Unable to fetch API'));
     */
}

const handleImage = (req, res, db) => {
    const { id, faces } = req.body;

    db('users').where({id: id}).increment('entries', faces)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        }).catch(err => res.status(400).json('unable to get entries'))
}

export {handleImage, handleAPICall};