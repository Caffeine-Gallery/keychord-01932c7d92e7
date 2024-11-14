export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getHighScore' : IDL.Func([], [IDL.Nat], ['query']),
    'getStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'avgAccuracy' : IDL.Nat,
            'gamesPlayed' : IDL.Nat,
            'highScore' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'updateHighScore' : IDL.Func([IDL.Nat], [IDL.Nat], []),
    'updateStats' : IDL.Func([IDL.Nat], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
