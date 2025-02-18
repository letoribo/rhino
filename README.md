## Inspiration
[Neo4J Discord channels](https://res.cloudinary.com/dzd5mddlm/video/upload/du_36,eo_37,so_1/v1736734697/Discord/chw0fqc3wybqxsszb4dz.mp4)
## What it does
**get discord server channels**
![Guild Channels](https://res.cloudinary.com/dzd5mddlm/image/upload/v1736741379/Discord/z82lbnbxwr9p6u35rjhi.png)
You can see also the channels not visible in Discord app although without messages.
At least you can find out that they exist.

**get channel messages**
![Discord](https://res.cloudinary.com/dzd5mddlm/image/upload/v1736740532/Discord/fd4bj0fjefwdbqzgukg3.png)

**send a message**
![message_post](https://res.cloudinary.com/dzd5mddlm/image/upload/v1739892426/Discord/e0splmlayr0qspcrtcr3.png)

If you are not a member of the server, you will not be able to see messages, so the server channels page provides the ability to join
![Invite link](https://res.cloudinary.com/dzd5mddlm/image/upload/v1736745865/Discord/kycwlpuih8xlclzetebi.png)
This video shows the transitions between frontend pages:
[Rhino Fronton](https://res.cloudinary.com/dzd5mddlm/video/upload/du_40,eo_42,so_2/v1736746596/Discord/v50ivbhiieqojarh8ew9.mp4)

**pass messages as a context to RAG**
![dRAG](https://res.cloudinary.com/dzd5mddlm/image/upload/v1736740216/Discord/ywnkr7u3gpxhxkhwp2cy.png)
## How we built it
The app is initially written in Python and has a large set of features that you can learn about on the [GraphRAG](https://discord.gg/graphrag) server.

Although the Modus version is less extensive from the point of backend,
but the frontend has surpassed the original application in many ways
## Challenges we ran into
Apparently Discord decided to apply restrictions and now I can only get 2 messages in Discord guild via HTTP API.
Discord has strict rate limits on API requests. If you've made too many requests in a short period, you may be temporarily limited in the number of messages you can retrieve.
## Accomplishments that we're proud of
I opened an issue
[Adding nodes in Neo4j](https://github.com/hypermodeinc/modus/issues/671)
and now everything works perfectly
## What we learned
I was already familiar with Modus and
this time I got acquainted with AssemblyScript
## What's next for Rhino
I plan to add more features
