#ifndef GAMEWORLD_H_INCLUDED
#define GAMEWORLD_H_INCLUDED

#include "Snake.h"
#include "Wave.h"
#include "GameObjects.h"

<<<<<<< HEAD
#define HEIGHT 720
#define WIDTH  640

=======
>>>>>>> 032c0821c74b8fe69a78c26c76948be94564b40a
class GameWorld
{
public:
    GameWorld(int width, int height);

    void update();

private:
    int _width, _height;

    Snake _snake;
    Bonus _bonus;

    std::list<Wave> _waves;
    std::vector<WavePoint> _background;

    std::list<Bomb> _bombs;
};

#endif // GAMEWORLD_H_INCLUDED
