##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJWJnVhAAoJEHNBsVwHCHesPmMIALeKhpZRjzrXUoFQlKw5n7Sy
k92HtUJzp+ZQuP+HiVhLsUzUbhk0O/vtAA7V3e4HJ9dU4Psea+9CKXh47p650mQF
1qOQ5Pid39UZ/zsit6fc4vYNM3vWwEbjHuGOUD5PVAfttPLhBH9w6G2s2zxwGXcx
hEOheYmNxpIYYHoXb2e4jx+i6YtW8U28J2yDB9lruowIooDYknQxCcIGRg4pJrEa
etYqtc3MD1N5xKxK1T7gh4jK0s5Rv0wc+6eX09wLwA4ooAbULxOOMCoCyQyN+q4S
uWH28hNeUAvI9aGau4Am04bcJzNvOdtuBB0QbHu3xPLIhPS0xXS4zZLctYz2rK8=
=55si
-----END PGP SIGNATURE-----

```

<!-- END SIGNATURES -->

### Begin signed statement 

#### Expect

```
size   exec  file            contents                                                        
             ./                                                                              
15             .gitignore    44d20a8fa365553cb3fc77c3b81d228a44fe28b980b4a3907a6120d58af3253b
93             .jshintrc     ac72baaccc327aca1aa7b22eb98d0eec7b15a69cfc2fe5a568c6f086ba8e2197
32             .npmignore    97df9979b36f6537fbdd6bacf86a9c534a0548be28fd3c038be3e33502b76d9a
620            example.js    b1e1f7469e1fb5e8bb38d88a0c95ad89c4d02074dd5a0af8830e337dacb1f17f
513            package.json  7899444e5b69cb85941ecee2a1dc3afd52349def778c220cba428c9cc9e74f7a
1330           README.md     10addbae27687d65f7c6db6896875030ccb3397cc183359e459de1b9d4fb1638
               src/                                                                          
8772             main.js     0ae9ad6ef850da8296b8214fe0790ab99defbec73dd90bf8ef517b89c90b61ba
               test/                                                                         
10636            test.js     8a149f597584cdde54120f63dd3f8c5a32d0ee25d1c929acb2cd7e57327c15d8
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