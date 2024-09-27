#include "GameWorld.h"

<<<<<<< HEAD


=======
>>>>>>> 032c0821c74b8fe69a78c26c76948be94564b40a
GameWorld::GameWorld(int width, int height) :
    _width(width),
    _height(height),
    _snake(25, 23),
    _bonus(0, 0)
{
    _waves.push_front(Wave(25, 23, 30, 1));
    _waves.front().ampl = 400;
}
