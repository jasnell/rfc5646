##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVuGBZAAoJEHNBsVwHCHesLzkH/REd3jc0BRBfMH2eyS4C/+sq
djZDODZzvbeXjPcSzPFV4l552HdzNElO5gi7TkczyYsUhj19wCnSYx+52snFETPW
OnmIdFXt5gcpzWn57sSRSw1p5CbTjG/krMfscovFVTm5cmTZY0nYI36i8Jc3wKQg
uanbkNEdYWGGHhCTyqvgYH+IGfkX7kBpFVBN0HmwAtxtwSwqhc+4EeZPqQeCExW7
+E4cUPteYeVRJ1fP9cUiMatLARi+7XFBrU6D+njCO0G6iJG9ozzf3jQMf/qQqqwp
6iTKymUVeLyA3N13ArfY6XxzxMZrLMFW7zFNLAURZ0gdDRJU8nXMGGVX83u58MY=
=yKv5
-----END PGP SIGNATURE-----

```

<!-- END SIGNATURES -->

### Begin signed statement 

#### Expect

```
size   exec  file            contents                                                        
             ./                                                                              
15             .gitignore    44d20a8fa365553cb3fc77c3b81d228a44fe28b980b4a3907a6120d58af3253b
75             .jshintrc     516823ae78f6da2c087c9052a589370f1b25413f3b19507b0a1156b59f2e1d70
32             .npmignore    97df9979b36f6537fbdd6bacf86a9c534a0548be28fd3c038be3e33502b76d9a
620            example.js    b1e1f7469e1fb5e8bb38d88a0c95ad89c4d02074dd5a0af8830e337dacb1f17f
513            package.json  92db068a5d4298adba471e156063948b71d4891029e5bec41acbc11165341f6d
1330           README.md     10addbae27687d65f7c6db6896875030ccb3397cc183359e459de1b9d4fb1638
               src/                                                                          
9180             main.js     c4616cd4959ed96f5f207325be2a331c238e641fe36416c523bb451d03536d26
               test/                                                                         
10624            test.js     37b65e00dd6cb2cb434db4ffde8c6e6aa4f290d242da705bdaa457b2c4f7db17
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