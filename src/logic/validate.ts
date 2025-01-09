const bannedWords: string[] = [
    'fuck', 'dick', 'faggot', 'nigga', 'nigger', 'schizo', 'nazi',
    'gay', 'ass', 'pussy', 'whore', 'hag', 'cock', 'wank', 'slut',
    'retard', 'degenerate', 'rightoid', 'fag', 'libtard', 'incel',
    'kraut', 'negro', 'beaner', 'spic', 'cracker'
];

const validateName = (name: string): boolean => {
  if (!(/^\w{4,}$/i).test(name))
    return false;

  for (const word of bannedWords)
    if (name.toLowerCase().includes(word))
      return false;

  return true;
};

const validateEmail = (email: string): boolean =>
    (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g).test(email);

export { validateName, validateEmail };