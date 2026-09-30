# Design revision tag for files that change in a build. A download carries the revision in which that file last
# changed: publish.py keeps a byte-identical part or plate under its old name, and deletes the old version of anything
# that changed, so an old download can't be mistaken for the current one. Bump it with each MOC that changes a part.
REV = 'revA7'   # MOC-007 (Sep 27 2026): deck only (moto:bit risers)
