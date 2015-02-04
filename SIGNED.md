##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJU0X7wAAoJEHNBsVwHCHesF6EIAIYOnT+IyktmPSpo8CNp7gcf
1PLr7C9sosC+++XwuHQEkWup2KhDwZcnlUyFAhwts8nyNuRq4Q6ap8iFRexEET9s
FPL0lWWBMpQbtDzfZ9OVmxj4HHYkzotX3iT50Cj+fN1ZCs1819Go48ZANZG7FCfK
JG3OEXCTM9ba1n9oohA9++XzfLCYRP3yNJvgW4Rat9C5IjvUqANmaHk4NUe1xP1g
Ojh2lliRwKBQOdepJmAAtISLNcoIMKLm5WRaLu5u6Tmbf8T8QCMxDmCSoCQZV2KO
TaTzAg1VhwB82JoBSIICzWSojZxTSibHDoh4wXZIOGM6fSigOvERNNM9w3HzqwU=
=blsH
-----END PGP SIGNATURE-----

```

<!-- END SIGNATURES -->

### Begin signed statement 

#### Expect

```
size  exec  file            contents                                                        
            ./                                                                              
15            .gitignore    44d20a8fa365553cb3fc77c3b81d228a44fe28b980b4a3907a6120d58af3253b
477           Gruntfile.js  63e44660a66f6b3a9ae58f089a2454d972412be4aef9755bf49497a4f3bc0026
1308          README.md     87a82c80b319e3f20373b3d5004ba2afc763edf79e20caec878bb7d93fbb27fc
620           example.js    b1e1f7469e1fb5e8bb38d88a0c95ad89c4d02074dd5a0af8830e337dacb1f17f
423           package.json  9db3c6cb5964135a6adcef490467bc748ff0b6fac9be74a8f9b8c80b3e5d87e4
              src/                                                                          
9148            main.js     d4081bf54f94a96c09439367a5bb4bc7362e42e263f9581d242d2031d0172935
```

#### Ignore

```
/SIGNED.md
```

#### Presets

```
git      # ignore .git and anything as described by .gitignore files
dropbox  # ignore .dropbox-cache and other Dropbox-related files    
kb       # ignore anything as described by .kbignore files          
```

<!-- summarize version = 0.0.9 -->

### End signed statement

<hr>

#### Notes

With keybase you can sign any directory's contents, whether it's a git repo,
source code distribution, or a personal documents folder. It aims to replace the drudgery of:

  1. comparing a zipped file to a detached statement
  2. downloading a public key
  3. confirming it is in fact the author's by reviewing public statements they've made, using it

All in one simple command:

```bash
keybase dir verify
```

There are lots of options, including assertions for automating your checks.

For more info, check out https://keybase.io/docs/command_line/code_signing