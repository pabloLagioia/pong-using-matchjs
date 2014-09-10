pong-using-matchjs
==================

Pong game using Matchjs javascript game engine

# What's going on here?
Match is a javascript game engine focused on modules, rehusability and ease of use.

#Main concepts

Match uses a paradigm called Behaviour Attribute Entity (BEA).

## Attributes
Attributes are dumb objects that store values, ie. speed, position, direction, etc.

## Behaviours
Behaviours read the attributes and perform changes on them, for example, a behaviour called move would change the x and y values of the location attribute.

## Views/Displays
Views or displays are objects that can be rendered.

## Entities
An entity is gathers attributes, behaviours and displays. This will be your final game object.

*The code in the example should be self explanatory*