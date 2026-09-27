# Design revision tag for files that change in a build. A download carries the revision in which that file last
# changed: publish.py keeps a byte-identical part or plate under its old name, and deletes the old version of anything
# that changed, so an old download can't be mistaken for the current one. Bump it with each MOC that changes a part.
REV = 'revA6'   # MOC-006 (Sep 27 2026): deck only
