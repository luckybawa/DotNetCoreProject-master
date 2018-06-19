using System;
using System.Collections.Generic;
using Core.Common.Data.Interfaces;
using Core.Common.Data.Models;
using Core.Common.Utilities;
using DotNetCoreWebAppModels.Models;

namespace DotNetCoreWebAppModels.Models
{
    public sealed class Track : BaseObjectWithState, IObjectWithState
    {
        public Track()
        {
            InvoiceLine = new HashSet<InvoiceLine>();
            PlaylistTrack = new HashSet<PlaylistTrack>();
            Guid = StringUtils.GenerateLowercase32DigitsGuid();
            DateCreated = DateTime.Now;
            DateModified = DateCreated;
        }

        public long TrackId { get; set; }
        public string Name { get; set; }
        public long? AlbumId { get; set; }
        public long MediaTypeId { get; set; }
        public long? GenreId { get; set; }
        public string Composer { get; set; }
        public long Milliseconds { get; set; }
        public long? Bytes { get; set; }
        public string UnitPrice { get; set; }

        public ICollection<InvoiceLine> InvoiceLine { get; set; }
        public ICollection<PlaylistTrack> PlaylistTrack { get; set; }
        public Album Album { get; set; }
        public Genre Genre { get; set; }
        public MediaType MediaType { get; set; }
    }
}
