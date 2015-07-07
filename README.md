# Deferred asset loader

# Trivia
There are several heavy-weight resources that could be used right after **fully loaded,** for instance, short videos.
This mechanism allows:

- preload all these assets in handy way;
- provide the usual UX (kind of _Loading..._ image until al the assets are not loaded).

# Usage
The code is commented well.

1. Create folders for media resources (_loading..._ image, video files).
  * **Pay attention,** resources located on another servers are not supported!
1. Edit the path variavles in the `main.js`.
1. Edit the `mainLogic();` method to reflect the logic you want to see.
 
Good luck!
