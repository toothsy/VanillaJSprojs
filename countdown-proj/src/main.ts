import Singleton from "./Singleton";
import { setup, tick } from "./threeJSstuff";

Singleton.ins = new Singleton();

setup();
tick();
