using System;
using System.Collections.Generic;
using Core.Common.Data.Interfaces;
using Core.Common.Data.Models;
using Core.Common.Utilities;
using DotNetCoreWebAppModels.Models;

namespace DotNetCoreWebAppModels.Models
{
    public sealed class Album : BaseObjectWithState, IObjectWithState
    {
        public Album()
        {
            Track = new HashSet<Track>();
            Guid = StringUtils.GenerateLowercase32DigitsGuid();
            DateCreated = DateTime.Now;
            DateModified = DateCreated;
        }

        public long AlbumId { get; set; }
        public string Title { get; set; }
        public long ArtistId { get; set; }

        public ICollection<Track> Track { get; set; }
        public Artist Artist { get; set; }
    }
}
