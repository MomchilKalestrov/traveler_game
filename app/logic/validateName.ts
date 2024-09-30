const bannedWords: Array<string> = [
    'fuck', 'dick', 'faggot', 'nigga', 'nigger', 'schizo', 'nazi',
    'gay', 'ass', 'pussy', 'whore', 'hag', 'cock', 'wank', 'slut',
    'retard', 'degenerate', 'rightoid', 'fag', 'libtard', 'incel',
    'kraut', 'negro', 'beaner', 'spic',
    
];

const validateName = (name: string): boolean => {
  if (!(/^\w{4,}$/i).test(name))
    return false;

  for (const word of bannedWords)
    if (name.toLowerCase().includes(word))
      return false;

  return true;
}

export default validateName;