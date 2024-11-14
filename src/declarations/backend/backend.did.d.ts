import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'getHighScore' : ActorMethod<[], bigint>,
  'getStats' : ActorMethod<
    [],
    { 'avgAccuracy' : bigint, 'gamesPlayed' : bigint, 'highScore' : bigint }
  >,
  'updateHighScore' : ActorMethod<[bigint], bigint>,
  'updateStats' : ActorMethod<[bigint], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
